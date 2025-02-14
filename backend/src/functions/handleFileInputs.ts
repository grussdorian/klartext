import { extractTextFromPdf, extractTextFromWord } from '../utils/fileUtils';

// Separate function to handle file input
async function handleFileInput(file: Express.Multer.File): Promise<string> {
  switch (file.mimetype) {
    case 'application/pdf':
      return extractTextFromPdf(file.buffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractTextFromWord(file.buffer);
    case 'text/plain':
      return file.buffer.toString('utf-8');
    default:
      throw new Error("Unsupported file type");
  }
}

export { handleFileInput };