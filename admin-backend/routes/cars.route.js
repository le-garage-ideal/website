import express from 'express';
import { Brand, Model, Car, updateBrands, updateModels, updateCars, selectBrands, selectModels, selectCars } from '../mongodb/process-collections.js';

export const carsRouter = express.Router();
carsRouter.get('/like/:variant', (req, res, next) => {
  selectCars({variant: new RegExp(`.*${req.params.variant}.*`, 'gi')}, doc => doc).then(result => res.json(result));
});
carsRouter.get('', (req, res, next) => {
  selectCars({}, doc => doc).then(result => res.json(result));
});

carsRouter.post('', (req, res, next) => {
  if (req.body.carId || !req.body.variant || (!req.body.url && !req.body.selectedFavcarsUrl)) {
    res.status(400).send('Bad parameters');
  } else {
    const car = new Car();
    car.model = req.body.model;
    car.variant = req.body.variant;
    car.power = req.body.power;
    car.officialWeight = req.body.officialWeight;
    car.weight = req.body.weight;
    car.options = req.body.options;
    car.startYear = req.body.startYear;
    car.endYear = req.body.endYear;
    car.selectedFavcarsUrl = req.body.url ? req.body.url : req.body.selectedFavcarsUrl;
    car.selectedFavcarsVariant = req.body.variant;
    car.save().then(result => res.json(result));
  }
});
carsRouter.put('', (req, res, next) => {
    if (!req.body.carId || !req.body.variant || (!req.body.url && !req.body.selectedFavcarsUrl)) {
      res.status(400).send('Bad parameters');
    } else {
      updateCars({_id: req.body.carId}, doc => {
        doc.selectedFavcarsVariant = req.body.variant;
        doc.selectedFavcarsUrl = req.body.url ? req.body.url : req.body.selectedFavcarsUrl;
      }).then(result => res.json(result[0]));
    }
});
carsRouter.delete('/:carId', (req, res, next) => {
  if (!req.params.carId) {
    res.status(400).send('Bad parameters');
  } else {
    Car.deleteOne({_id: req.params.carId}).then(() => res.sendStatus(200));
  }
});
carsRouter.delete('/favcars/:carId', (req, res, next) => {
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


