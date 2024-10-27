import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { extractTextFromPdf, extractTextFromWord } from './utils/fileUtils';

dotenv.config();

const app = express();
const api_key = process.env.OPENAI_API_KEY;
const port = 7171;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

const upload = multer();

// Define types for audience options
type AudienceGroup = "Scientists and Researchers" | "Students and Academics" | "Industry Professionals" | "Journalists and Media Professionals" | "General Public";

// Simplify text based on user group
const simplifyText = async (text: string, userGroup: AudienceGroup): Promise<string> => {
  let prompt: string;
  
  switch (userGroup) {
    case "Scientists and Researchers":
      prompt = `Simplify the following text for scientists and researchers:\n\n${text}`;
      break;
    case "Students and Academics":
      prompt = `Simplify the following text for students and academics:\n\n${text}`;
      break;
    case "Industry Professionals":
      prompt = `Simplify the following text for industry professionals:\n\n${text}`;
      break;
    case "Journalists and Media Professionals":
      prompt = `Simplify the following text for journalists and media professionals:\n\n${text}`;
      break;
    default:
      prompt = `Simplify the following text for the general public (non-expert audience):\n\n${text}`;
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

app.post('/simplify', upload.single('file'), async (req: Request, res: Response) => {
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
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error processing file" });
    }
  }

  try {
    const simplifiedText = await simplifyText(extractedText, audience);
    res.json({ simplifiedText });
  } catch (error) {
    res.status(500).json({ error: "Error during text simplification" });
  }
});


app.get('/word-info', async (req: Request, res: Response) => {
  const word = req.query.word as string;

  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  try {
    const definitionResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const synonymResponse = await axios.get(`https://api.datamuse.com/words?rel_syn=${word}`);

    const definition = definitionResponse.data[0]?.meanings[0]?.definitions[0]?.definition || "Definition not found";
    const synonyms = synonymResponse.data.map((syn: { word: string }) => syn.word) || ["No synonyms found"];

    res.json({ word, definition, synonyms });
  } catch (error) {
    console.error("Error fetching word info:", error);
    res.status(500).json({ error: "Error fetching word information" });
  }
});


// Rating
app.post('/rating', (req: Request, res: Response) => {
  const rating = parseInt(req.query.rating as string, 10);

  if (isNaN(rating) || rating < 1 || rating > 10) {
    return res.status(400).json({ error: "Rating must be a number between 1 and 10" });
  }

  console.log("User rated:", rating);
  // Future: Save rating to a database if needed
  res.status(200).json({ message: "Rating submitted successfully" });
});

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Server Working</h1>');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
