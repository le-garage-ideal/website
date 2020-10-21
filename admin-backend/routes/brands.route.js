const express = require('express');
const { selectBrands } = require('../mongodb/process-collections');

const brandsRouter = express.Router();

brandsRouter.get('', (_req, res) => {
  selectBrands({}, doc => doc).then(result => res.json(result));
});

exports.brandsRouter = brandsRouter;
