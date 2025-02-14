import { simplifyText } from '../src/functions/simplifyText';
import { saveToRedis } from '../src/functions/saveToRedis';
import { handleFileInput } from '../src/functions/handleFileInputs';
import { TargetAudiences } from '../src/types';
import redisClient from '../src/db';
import { createApiClient } from '../src/api/apiClient';
import fs from 'fs';
import path from 'path';

jest.mock('../src/db');
jest.mock('../src/api/apiClient');

describe('simplifyText', () => {
  it('should simplify text correctly', async () => {
    const mockApiClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Simplified text' } }]
        }
      })
    };
    (createApiClient as jest.Mock).mockReturnValue(mockApiClient);

    const result = await simplifyText('Some complex text', TargetAudiences.GeneralPublic, 'en', 'fakeApiKey');
    expect(result).toBe('Simplified text');
  });

  it('should throw an error if API call fails', async () => {
    const mockApiClient = {
      post: jest.fn().mockRejectedValue(new Error('API error'))
    };
    (createApiClient as jest.Mock).mockReturnValue(mockApiClient);

    await expect(simplifyText('Some complex text', TargetAudiences.GeneralPublic, 'en', 'fakeApiKey')).rejects.toThrow('Text simplification failed: API error');
  });
});

describe('saveToRedis', () => {
  it('should save response prompt to Redis', async () => {
    const setSpy = jest.spyOn(redisClient, 'set').mockResolvedValue('OK');
    await saveToRedis('Original text', TargetAudiences.GeneralPublic, 'Simplified text');
    expect(setSpy).toHaveBeenCalled();
  });
});


describe('handleFileInput', () => {
  it('should extract text from PDF file and match content', async () => {
    const filePath = path.join(__dirname, 'test_file2.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const file = {
      mimetype: 'application/pdf',
      buffer: fileBuffer
    } as Express.Multer.File;
    
    const result = await handleFileInput(file);
    console.log(result);
    const buffer = `

test pdf`;
    expect(result).toBe(buffer);
  });

  it('should extract text from PDF file and match content', async () => {
    const filePath = path.join(__dirname, 'test_file1.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const file = {
      mimetype: 'application/pdf',
      buffer: fileBuffer
    } as Express.Multer.File;
    
    const result = await handleFileInput(file);
    console.log(result);
    const buffer = `

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod`;
    expect(result).toBe(buffer);
  });

  it('should throw an error for unsupported file types', async () => {
    const file = {
      mimetype: 'application/unsupported',
      buffer: Buffer.from('Unsupported content')
    } as Express.Multer.File;
    await expect(handleFileInput(file)).rejects.toThrow('Unsupported file type');
  });
});
