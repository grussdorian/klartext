import {createHash} from 'crypto';
import cors from 'cors';
import {NextFunction, Request, Response} from 'express';
const TOKEN = process.env.DEV_TOKEN || "No token provided";
const allowedOrigin = 'https://simplifymytext.org';
const allowedExtension = process.env.EXTENSION_ID || 'error';
const extension_token = createHash('sha256').update(TOKEN).digest('hex');

const policy = cors({
  origin: (origin, callback) => {
    console.log(origin)
    if (!origin || origin.startsWith(allowedOrigin) || origin.startsWith(allowedExtension) || origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});

// Middleware to check the origin of incoming requests
function checkOrigin(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || req.headers.referer;
  const token = req.headers.token;
  if (origin && ( origin.startsWith(allowedOrigin) || (origin.startsWith(allowedExtension) && token === extension_token) || origin.startsWith("http://localhost") || origin.startsWith("https://localhost") ) ) {
      // Request is coming from the allowed frontend
      next();
  } else {
      // Reject request if it doesn't come from the allowed origin
      res.status(403).json({ message: 'Access denied: Requests from your origin are not allowed.' });
  }
}

export { policy, checkOrigin };