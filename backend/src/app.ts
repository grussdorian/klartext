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


dotenv.config();

const app = express();
const api_key = process.env.OPENAI_API_KEY || "error" ;
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

// Define types for audience options
type AudienceGroup = "Scientists and Researchers" | "Students and Academics" | "Industry Professionals" | "Journalists and Media Professionals" | "General Public";

// Simplify text based on user group
const simplifyText = async (text: string, userGroup: AudienceGroup): Promise<string> => {
  let prompt: string;

  const instructions = "Split long sentences into shorter sentences that are easily understood on their own."

  
  switch (userGroup) {
    case "Scientists and Researchers":
      prompt = `Simplify the following text for scientists and researchers:\n\n${text}.\n${instructions}`;
      break;
    case "Students and Academics":
      prompt = `Simplify the following text for students and academics:\n\n${text}\n${instructions}`;
      break;
    case "Industry Professionals":
      prompt = `Simplify the following text for industry professionals:\n\n${text}\n${instructions}`;
      break;
    case "Journalists and Media Professionals":
      prompt = `Simplify the following text for journalists and media professionals:\n\n${text}\n${instructions}`;
      break;
    default:
      prompt = `Simplify the following text for the general public (non-expert audience):\n\n${text}\n${instructions}`;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error during text simplification: ${errorMessage}`);
    return `Error during text simplification: ${errorMessage}`;
  } 

};

const saveToRedis = async (originalText: string, targetAudience: AudienceGroup, responsePrompt: string) => {
  const uniqueId = Date.now().toString();
  const key = `prompt|:|${originalText}|:|${targetAudience}|:|${uniqueId}`;
  await redisClient.set(key, responsePrompt);
};


app.post('/simplify', upload.single('file'), async (req: Request, res: Response) => {
  console.log("Simplify request received");
  const audience = req.body.audience as AudienceGroup;
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
    const simplifiedText = await simplifyText(extractedText, audience);
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
      1. A clear and concise definition.
      2. A list of synonyms (if any). If there are no synonyms, say "No synonyms found."
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an English language assistant." },
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