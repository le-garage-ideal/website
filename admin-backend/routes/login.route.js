import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret, backendUsers } from '../passwords.js';

export const loginRouter = express.Router();
loginRouter.post('', (req, res) => {
  if (!req.body.username || !backendUsers.has(req.body.username)) {
    res.status(401).send({ errorMessage: 'Unknown username / password' });
  }
  if (!req.body.password || backendUsers.get(req.body.username) !== req.body.password) {
    res.status(401).send({ errorMessage: 'Unknown username / password' });
  }

  const data = {
    name: req.body.username,
  };
  const expiration = '6h';

  const token = jwt.sign({ data, }, jwtSecret, { expiresIn: expiration, algorithm: 'HS256' });
  res.status(200).json({ username: req.body.username, token });
});
