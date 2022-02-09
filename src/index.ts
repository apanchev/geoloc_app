import * as dotenv from 'dotenv';
import express from 'express';

import apiRouter from './api/api.router';
import databaseRouter from './database/database.router';
import datasetRouter from './dataset/dataset.router';
import homeRouter from './home/home.router';

if (process.env.NODE_ENV === 'production') {
  console.debug(process.env.NODE_ENV);
  dotenv.config();
}
if (process.env.NODE_ENV === 'dev') {
  console.debug(process.env.NODE_ENV);
  dotenv.config({ path: './.env-dev' });
}

if (!process.env.PORT) {
  console.error('NO PORT SELECTED TO RUN THE APP ...');
  process.exit(1);
}

const app = express();

app.use(express.json({ limit: '500mb' }));
app.set('view engine', 'ejs');

// Routes

app.use('/', homeRouter);
app.use('/api', apiRouter);
app.use('/database', databaseRouter);
app.use('/dataset', datasetRouter);

// PORT definition and SERVER starting

const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
