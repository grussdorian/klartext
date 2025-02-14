import {Response, Router } from 'express';
import { CustomRequest } from '../../src/types';
import { createSession } from '../../src/session/session';

const setCookieRouter = Router();

const setCookies = async (req: CustomRequest, res: Response) => {
  // console.log(req.signedCookies);
  await createSession(req as CustomRequest, res);
  return res.status(200).send('Cookie set');
}

setCookieRouter.get('/set-cookie', setCookies);

export {setCookieRouter, setCookies};