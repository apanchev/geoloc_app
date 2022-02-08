import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
// import log from 'fancy-log';

import {apiRouter} from './api/api.router';
import {databaseRouter} from './database/database.router';
import {datasetRouter} from './dataset/dataset.router';
import {homeRouter} from './home/home.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();

app.use(express.json({limit: '500mb'}));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, '../views')));

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
