import { Request, Response, Router } from "express";
import { createApiClient } from '../../src/api/apiClient'
import { get } from "http";
const apiKey = process.env.OPENAI_API_KEY || "error" ;

const wordInfoRouter = Router();

const getWordInfo = async (req: Request, res: Response) => {
  const word = req.query.word as string;

  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  const userPrompt = `
  Provide the following details for the word "${word}":
  1. A clear and concise definition in plain language. If no definition exists, say "No definitions found."
  2. A list of synonyms (if any). If there are no synonyms, say "No synonyms found."
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
};

wordInfoRouter.get("/word-info", getWordInfo);

export { getWordInfo, wordInfoRouter };
