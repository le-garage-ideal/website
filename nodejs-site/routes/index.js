import express from 'express';
import { Brand, Model, Car, updateBrands, updateModels, updateCars, selectBrands, selectModels, selectCars } from '../mongodb/process-collections.js';

/* GET home page. */
export const router = express.Router();
router.get('/:variant', (req, res, next) => {
  selectCars({variant: new RegExp(`.*${req.params.variant}.*`, 'gi')}, doc => doc).then(result => res.json(result));
});
router.put('/', (req, res, next) => {
    if (!req.body.carId || !req.body.variantName) {
      res.status(400).send('Bad parameters');
    } else {
      updateCars({_id: req.body.carId}, doc => doc.selectedFavcarsVariant = req.body.variantName).then(result => res.json(result[0]));
    }
});


