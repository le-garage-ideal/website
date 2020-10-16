import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';

import { brandsRouter } from './routes/brands.route.js';
import { modelsRouter } from './routes/models.route.js';
import { carsRouter } from './routes/cars.route.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectToMongoDb from './mongodb/mongodb.datasource.js';
import mongoose from 'mongoose';
import cors from 'cors';

const db = connectToMongoDb(mongoose);

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

if (app.get('env') === 'production') {
    app.use(logger('combined'));
} else {
    app.use(logger('dev'));
}
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/cars', carsRouter);
app.use('/brands', brandsRouter);
app.use('/models', modelsRouter);

