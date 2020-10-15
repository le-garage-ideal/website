import express from 'express';
import { selectModels } from '../mongodb/process-collections.js';

export const modelsRouter = express.Router();

modelsRouter.get('', (req, res, next) => {
  selectModels({}, doc => doc).then(result => res.json(result));
});
