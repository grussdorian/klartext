import { Router, Response, Request } from 'express';
import { CustomRequest } from '../../src/types'; 
import { createSession } from '../../src/session/session';

const defaultRouter = Router();

defaultRouter.get('/',(req: Request, res: Response) => {
  res.send('<h1>Server Working, firewall off</h1>');
});

export  {defaultRouter};
