import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync( '/etc/ssl/private/_.simplifymytext.org_private_key.key'),
      cert: fs.readFileSync('/etc/ssl/simplifymytext.org_ssl_certificate.cer'),
    },
  },
  define: {
    'process.env': process.env
  },
});
