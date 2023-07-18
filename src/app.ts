/* eslint-disable no-console */
import express, { json } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import rootRouter from './routes/root';

require('dotenv').config();

const { PORT = 3000, DB_CONNECTION = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(rootRouter);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_CONNECTION);

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
