// session handler
// handles session creation, deletion, and validation
// uses cookies to store session data
// also inserts new users by their client fingerprint


import { Request, Response } from 'express';
import redisClient from '../db';
import crypto from 'crypto';

// extend the Request interface to include cookies
interface CustomRequest extends Request {
    cookies: { [key: string]: string };
}

// function to check if a cookie is present
export function checkCookie(req: CustomRequest): boolean {
    return req.cookies !== undefined && Object.keys(req.cookies).length > 0;
}

// function to add a new user to the redis database
async function insertUser(clientFingerprint: string): Promise<void> {
    await redisClient.sAdd('users', clientFingerprint);
}

// function to create fingerprint from user's metadata
function createFingerprint(req: CustomRequest): string {
  const ipAddress = req.ip;
  const data = [
      ipAddress ?? '',
      req.headers['user-agent'] ?? '',
      req.headers['accept-language'] ?? '',
      req.headers['accept-encoding'] ?? '',
      req.headers['accept'] ?? '',
      req.headers['connection'] ?? '',
      req.headers['dnt'] ?? '',
      req.headers['upgrade-insecure-requests'] ?? '',
      req.headers['sec-fetch-site'] ?? '',
      req.headers['sec-fetch-mode'] ?? '',
      req.headers['sec-fetch-dest'] ?? '',
      req.headers['referer'] ?? '',
      req.headers['host'] ?? ''
  ].join('');

  return crypto.createHash('sha256').update(data).digest('hex');
}

// function to handle session creation
export async function createSession(req: CustomRequest, res: Response): Promise<void> {
    if (!checkCookie(req)) {
        const clientFingerprint = createFingerprint(req);
        await insertUser(clientFingerprint);
        res.cookie('userID', clientFingerprint, { signed: true, httpOnly: true, secure: true });
    }
}