import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { router } from './routes/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectToMongoDb from './mongodb/mongodb.datasource.js';
import mongoose from 'mongoose';
import cors from 'cors';

const db = connectToMongoDb(mongoose);

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

