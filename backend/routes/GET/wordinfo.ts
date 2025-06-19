import { Request, Response, Router } from "express";
import { createApiClient } from '../../src/api/apiClient'
import { get } from "http";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY || "error" ;

const wordInfoRouter = Router();

const getWordInfo = async (req: Request, res: Response) => {
  const word = req.query.word as string;
  const language = req.query.language as string || "English";

  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  const userPrompt = `
  Provide the following details for the word "${word}" in ${language}:
  1. A clear and concise definition in plain language. If no definition exists, say "No definitions found."
  2. A list of synonyms (if any). If there are no synonyms, say "No synonyms found."
`;

  try {
    const apiClient = createApiClient(apiKey);

    const response = await apiClient.post('', {
        model: "gpt-4",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 20,
        temperature: 0
      }
    );

    const responseContent = response.data.choices[0]?.message?.content || "";
    console.log("AI Response:", responseContent);
    // Parse the AI response into a structured JSON (assuming it follows the format of the prompt)
    const [definitionMatch, synonymsMatch] = responseContent.split("\n").map((line: string) => line.split(":")[1]?.trim());
    const definition = definitionMatch || "Definition not found";
    const synonyms = synonymsMatch ? synonymsMatch.split(",").map((synonym: string) => synonym.trim()) : ["No synonyms found"];

    res.json({ word, definition, synonyms });
  } catch (error) {
    console.error("Error fetching word info:", error);
    res.status(500).json({ error: "Error fetching word information" });
  }
};

wordInfoRouter.get("/word-info", getWordInfo);

export { getWordInfo, wordInfoRouter };
