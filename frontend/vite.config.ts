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
  define: {
    'process.env': JSON.stringify(process.env)
  },
  plugins: [react()],
  server: {
    proxy: {
      '/set-cookie': {
        target: 'http://localhost:7171', // Your backend server URL
        changeOrigin: true,
        secure: false
      }
    },
    https: isHTtpsEnabled ? {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    } : undefined,
  },
};

// if (isHTtpsEnabled) {
//   config["server"] = {
//     https: {
//       key: fs.readFileSync(SSL_KEY_PATH),
//       cert: fs.readFileSync(SSL_CERT_PATH),
//     },
//     proxy: {
//       '/set-cookie': {
//         target: 'http://localhost:7171', // Your backend server URL
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   };
// }

export default defineConfig(config);