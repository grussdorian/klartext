import { Response, Router } from "express";
import { CustomRequest } from "../../src/types";
import { Feedback } from "../../types";
import { checkCookie } from '../../src/session/session';
import redisClient from '../../src/db';

const feedbackRouter = Router();

const handleFeedback = (req: CustomRequest, res: Response) => {
  console.log("Feedback received");
  const { rating, text, context, category, simplifiedText }: Feedback = req.body
  console.log("req: ", req);
  if (!checkCookie(req)) {
    return res.status(400).json({ error: "User not authenticated" });
  }
  const userID = process.env.COOKIE === 'deploy' ? req.signedCookies.userID : req.cookies.userID;
  console.log("User ID: ", userID);
  if (userID === undefined || userID === null) {
    return res.status(400).json({ error: "User not authenticated" });
  }
  
  if (isNaN(rating) || rating < 1 || rating > 10) {
    return res.status(400).json({ error: "Rating must be a number between 1 and 10" });
  }

  console.log("User rated:", rating);
  console.log("User feedback: ", text);
  console.log("User context: ", context);
  console.log("User category: ", category);
  console.log("Simplified text: ", simplifiedText);
  // save data to redis database. With every user there's a set of feedback objects
  const key = `feedback|:|${userID}`;
  const feedback = { rating, text, context, category, simplifiedText };
  redisClient.sAdd(key, JSON.stringify(feedback));
  res.status(200).json({ message: "Rating submitted successfully" });
}

feedbackRouter.post('/feedback', handleFeedback);

export { feedbackRouter, handleFeedback };