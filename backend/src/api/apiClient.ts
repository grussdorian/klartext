import axios from 'axios';

export const createApiClient = (apiKey: string) => {
  return axios.create({
    baseURL: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};
