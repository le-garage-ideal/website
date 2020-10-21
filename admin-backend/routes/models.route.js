const express = require('express');
const { selectModels } = require('../mongodb/process-collections');

const modelsRouter = express.Router();

modelsRouter.get('', (_req, res) => {
  selectModels({}, doc => doc).then(result => res.json(result));
});

exports.modelsRouter = modelsRouter;
