const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const cors = require('cors');

const { jwtSecret } = require('./passwords');
const { brandsRouter } = require('./routes/brands.route');
const { modelsRouter } = require('./routes/models.route');
const { carsRouter } = require('./routes/cars.route');
const { loginRouter } = require('./routes/login.route');
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const { connectToMongoDb } = require('./mongodb/mongodb.datasource');

connectToMongoDb(mongoose);

const app = express();

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
app.use(jwt({ secret: jwtSecret, exp: '6h', algorithms: ['HS256'] }).unless({ path: ['/login'] }));

app.use('/cars', carsRouter);
app.use('/brands', brandsRouter);
app.use('/models', modelsRouter);
app.use('/login', loginRouter);

exports.app = app;
