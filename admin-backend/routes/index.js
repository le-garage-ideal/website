import express from 'express';
import { Brand, Model, Car, updateBrands, updateModels, updateCars, selectBrands, selectModels, selectCars } from '../mongodb/process-collections.js';

/* GET home page. */
export const router = express.Router();
router.get('/cars/like/:variant', (req, res, next) => {
  selectCars({variant: new RegExp(`.*${req.params.variant}.*`, 'gi')}, doc => doc).then(result => res.json(result));
});
router.get('/cars', (req, res, next) => {
  selectCars({}, doc => doc).then(result => res.json(result));
});
router.get('/brands', (req, res, next) => {
  selectBrands({}, doc => doc).then(result => res.json(result));
});
router.get('/models', (req, res, next) => {
  selectModels({}, doc => doc).then(result => res.json(result));
});
router.post('/cars', (req, res, next) => {
  if (req.body.carId || !req.body.variantName || !req.body.url) {
    res.status(400).send('Bad parameters');
  } else {
    updateCars({_id: req.body.carId}, doc => {
      doc.selectedFavcarsVariant = req.body.variantName;
      doc.selectedFavcarsUrl = req.body.url;
    }).then(result => res.json(result[0]));
  }
});
router.put('/cars', (req, res, next) => {
    if (!req.body.carId || !req.body.variantName || (!req.body.url && !req.body.selectedFavcarsUrl)) {
      res.status(400).send('Bad parameters');
    } else {
      updateCars({_id: req.body.carId}, doc => {
        doc.selectedFavcarsVariant = req.body.variantName;
        doc.selectedFavcarsUrl = req.body.url || req.body.selectedFavcarsUrl;
      }).then(result => res.json(result[0]));
    }
});
router.delete('/cars/:carId', (req, res, next) => {
  if (!req.params.carId) {
    res.status(400).send('Bad parameters');
  } else {
    Car.deleteOne({_id: req.params.carId}, err => { if (err) res.sendStatus(500).json(err); } );
  }
});
router.delete('/cars/favcars/:carId', (req, res, next) => {
  if (!req.params.carId) {
    res.status(400).send('Bad parameters');
  } else {
    updateCars({_id: req.params.carId}, doc => {
      doc.selectedFavcarsVariant = null;
      doc.selectedFavcarsUrl = null;
      doc.favcarsVariants = [];
    }).then(result => res.json(result[0]));
  }
});


