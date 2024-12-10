import * as fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';



// Function to read a PDF file and extract text
export async function extractTextFromPdf(fileBuffer: Buffer): Promise<string> {   
    try {
        // Directly pass the Buffer to pdf-parse
        const data = await pdf(fileBuffer);
        return data.text.slice(0,5000); // Return the extracted text
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error reading PDF file:", error);
        return `Error reading PDF file: ${errorMessage}`;
    }
}

// Function to read a Word file and extract text
export async function extractTextFromWord(fileBuffer: Buffer): Promise<string> {
    try {
        const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
        return value.slice(0, 5000); // The extracted text
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error reading Word file:", error);
        return `Error reading Word file: ${errorMessage}`;
    }
}
