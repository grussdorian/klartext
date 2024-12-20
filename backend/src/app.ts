import express, { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import https from 'https';
import fs from 'fs';
import { extractTextFromPdf, extractTextFromWord } from './utils/fileUtils';
import {createHash} from 'crypto';
import redisClient from './db';
import { Feedback } from '../types'
import { TargetAudiences } from './types'
import { createApiClient } from './api/apiClient'

dotenv.config();

const app = express();
const apiKey = process.env.OPENAI_API_KEY || "error" ;
const port = 7171;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "error";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "error";
const deploy = process.env.NODE_ENV === "deploy";
const TOKEN = process.env.DEV_TOKEN || "No token provided";
const allowedOrigin = 'https://simplifymytext.org';
const allowedExtension = process.env.EXTENSION_ID || 'error';
const wordLimit = Number(process.env.WORD_LIMIT) || 5000;
const extension_token = createHash('sha256').update(TOKEN).digest('hex');

app.use(cors({
  origin: (origin, callback) => {
    console.log(origin)
    if (!origin || origin.startsWith(allowedOrigin) || origin.startsWith(allowedExtension) || origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware to check the origin of incoming requests
function checkOrigin(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || req.headers.referer;
  const token = req.headers.token;
  if (origin && ( origin.startsWith(allowedOrigin) || (origin.startsWith(allowedExtension) && token === extension_token) || origin.startsWith("http://localhost") || origin.startsWith("https://localhost") ) ) {
      // Request is coming from the allowed frontend
      next();
  } else {
      // Reject request if it doesn't come from the allowed origin
      res.status(403).json({ message: 'Access denied: Requests from your origin are not allowed.' });
  }
}

app.use(checkOrigin)

app.use(express.json());

const upload = multer();

// Simplify text based on user group
const simplifyText = async (text: string, userGroup: TargetAudiences, apiKey: string): Promise<string> => {
  const instructions = "Do no write very long sentences. The language of the simplified text should match the language of the text I provide you with."

  // Map user groups to audience-specific prompts
  const targetAudience: Record<TargetAudiences, string> = {
    [TargetAudiences.ScientistsResearchers]: "scientists and researchers",
    [TargetAudiences.StudentsAcademics]: "students and academics",
    [TargetAudiences.IndustryProfessionals]: "industry professionals",
    [TargetAudiences.JournalistsMedia]: "journalists and media professionals",
    [TargetAudiences.GeneralPublic]: "the general public (non-expert audience)",
  };

  // Look up the audience prompt from the Record
  const audience = targetAudience[userGroup];

  // Build the user prompt dynamically
  const userPrompt = `
Simplify the following text for ${audience}:

"${text.trim()}"

Instructions: ${instructions}
  `;

  try {
    const apiClient = createApiClient(apiKey);

    const response = await apiClient.post('', {
        model: "gpt-4",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 200,
        temperature: 0.7
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(`Error during text simplification: ${errorMessage}`);
    throw new Error(`Text simplification failed: ${errorMessage}`);
  }

};

const saveToRedis = async (originalText: string, targetAudience: TargetAudiences, responsePrompt: string) => {
  const uniqueId = Date.now().toString();
  const key = `prompt|:|${originalText}|:|${targetAudience}|:|${uniqueId}`;
  await redisClient.set(key, responsePrompt);
};


app.post('/simplify', upload.single('file'), async (req: Request, res: Response) => {
  console.log("Simplify request received");
  const audience = req.body.audience as TargetAudiences;
  const text = req.body.text as string;
  const file = req.file;

  if (!file && !text) {
    return res.status(400).json({ error: "No text or file provided for simplification." });
  }

  let extractedText = text;

  if (file) {
    try {
      if (file.mimetype === 'application/pdf') {
        extractedText = await extractTextFromPdf(file.buffer);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromWord(file.buffer);
      } else if (file.mimetype === 'text/plain') { 
        extractedText = file.buffer.toString('utf-8'); 
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error processing file" });
    }
  }

  if (!extractedText) {
    return res.status(400).json({ error: "No text extracted from file" });
  } else if (extractedText.length > wordLimit) {
    return res.status(400).json(`Text is too long. Maximum length is ${wordLimit} characters`);
  }

  try {
    const simplifiedText = await simplifyText(extractedText, audience, apiKey);
    await saveToRedis(extractedText, audience, simplifiedText);
    res.json({ simplifiedText });
  } catch (error) {
    res.status(500).json({ error: "Error during text simplification" });
  }
});


app.get("/word-info", async (req: Request, res: Response) => {
  const word = req.query.word as string;

  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  try {
    const prompt = `
      Provide the following details for the word "${word}":
      1. A clear and concise definition, ideally one that could be found in an official dicitionary. If no definition exists, say "No definitions found."
      2. A list of synonyms (if any). If there are no synonyms, say "No synonyms found."
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a linguisitc expert." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,

      }
    );

    const responseContent = response.data.choices[0]?.message?.content || "";

    // Parse the AI response into a structured JSON (assuming it follows the format of the prompt)
    const [definitionMatch, synonymsMatch] = responseContent.split("\n").map((line: string) => line.split(":")[1]?.trim());
    const definition = definitionMatch || "Definition not found";
    const synonyms = synonymsMatch ? synonymsMatch.split(",").map((synonym: string) => synonym.trim()) : ["No synonyms found"];

    res.json({ word, definition, synonyms });
  } catch (error) {
    console.error("Error fetching word info:", error);
    res.status(500).json({ error: "Error fetching word information" });
  }
});


// Feedback
app.post('/feedback', (req: Request, res: Response) => {
  const { rating, text }: Feedback = req.body

  if (isNaN(rating) || rating < 1 || rating > 10) {
    return res.status(400).json({ error: "Rating must be a number between 1 and 10" });
  }

  console.log("User rated:", rating);
  console.log("User feedback: ", text)
  // Future: Save rating to a database if needed
  res.status(200).json({ message: "Rating submitted successfully" });
});

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Server Working</h1>');
});

if (deploy){
  const sslOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    console.log('Backend listening at https://simplifymytext.org:7171');
  });
} else {
  app.listen(port, ()=>{
    console.log(`Backend listening at http://localhost:${port}`);
  })
}