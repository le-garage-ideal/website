import { Request, Response } from "express";

import express from 'express';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

export const router = express.Router();
dotenv.config();

interface PriceResponse{
  price: string;
}
const formatInstructions = "Respond with a valid JSON object, containing one field: 'price' which is the price of the car in euros";
const parser = new JsonOutputParser<PriceResponse>();
const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const prompt = ChatPromptTemplate.fromTemplate("Anwser the user query.\n{format_instructions}\nGive the average price for the following car: {car_model}");

/* GET car price. */
router.post('/', async function(req: Request, res: Response) {
  const partialPrompt = await prompt.partial({
    format_instructions: formatInstructions,
  });
  const chain = partialPrompt.pipe(model).pipe(parser);
  const promptArgs = { car_model: req.body.model };
  const modelResponse = await chain.invoke(promptArgs);
  res.json(modelResponse);
});

