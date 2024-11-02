import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SSL_KEY_PATH = process.env.SSL_KEY_PATH ? path.resolve(process.env.SSL_KEY_PATH) : null;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH ? path.resolve(process.env.SSL_CERT_PATH) : null;
const isHTtpsEnabled = process.env.DEPLOY_MODE === "server" && SSL_KEY_PATH && SSL_CERT_PATH;

let config = {
  plugins: [react()],
  define: {
    'process.env': JSON.stringify(process.env)
  },
};

if (isHTtpsEnabled) {
  config["server"] = {
    https: {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    },
  };
}

export default defineConfig(config);