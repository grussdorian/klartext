// session handler
// handles session creation, deletion, and validation
// uses cookies to store session data
// also inserts new users by their client fingerprint


import { Request, Response } from 'express';
import redisClient from '../db';
import crypto from 'crypto';

// extend the Request interface to include signed cookies
interface CustomRequest extends Request {
    cookies: { [key: string]: string };
}

// function to check if a signed cookie named 'userID' is present
export function checkCookie(req: CustomRequest): boolean {
    if (process.env.NODE_ENV === 'deploy') {
        console.log(`cookie present? ${req.signedCookies !== undefined && req.signedCookies.userID !== undefined}`);
        return req.signedCookies !== undefined && req.signedCookies.userID !== undefined;
    }
    else {
        console.log(`cookie present? ${req.cookies !== undefined && req.cookies.userID !== undefined}`);
        return req.cookies !== undefined && req.cookies.userID !== undefined;
    }
}

// function to add a new user to the redis database
async function insertUser(clientFingerprint: string): Promise<void> {
    await redisClient.sAdd('users', clientFingerprint);
}

// function to create fingerprint from rabdom data
function createFingerprint(req: CustomRequest): string {
    const data = Math.random().toString(16).slice(2)
    return crypto.createHash('sha256').update(data).digest('hex');
}

// function to handle session creation
export async function createSession(req: CustomRequest, res: Response): Promise<void> {
    if (!checkCookie(req)) {
      const clientFingerprint = createFingerprint(req);
      const expires = new Date( Date.now() + 1000 * 60 * 60 * 24 * 30 * 9 ); // 9 months
      console.log(`Expiry date: ${expires}`);
      await insertUser(clientFingerprint);
      console.log('Creating new user');
        res.cookie('userID', clientFingerprint, { 
            signed: false,
            httpOnly: true,
            expires: expires,
            secure: process.env.NODE_ENV === 'deploy' ? true : false,
            sameSite: process.env.NODE_ENV === 'deploy' ? 'none' : 'lax', // Allow cross-site access,
        });
    }
}