import express from 'express';
import { selectBrands } from '../mongodb/process-collections.js';

export const brandsRouter = express.Router();

brandsRouter.get('', (req, res, next) => {
  selectBrands({}, doc => doc).then(result => res.json(result));
});
