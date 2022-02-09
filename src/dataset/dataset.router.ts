import { Request, Response, Router as router } from 'express';
import { mapSeries } from 'bluebird';
import fs from 'fs';
import Dataset from './dataset.service';

const got = require('got');

const datasetRouter = router();

datasetRouter.get('/load', async (req: Request, res: Response) => {
  const fileList = [
    ['band', './data/bands.json'],
    ['concert', './data/concerts.json'],
    ['venue', './data/venues.json'],
  ];

  mapSeries(fileList, async (file) => {
    try {
      const url = `http://localhost:${process.env.PORT}/dataset/load/${file[0]}`;
      const fileBody = await fs.promises.readFile(file[1], 'utf8');
      const data = await got.put(url, { json: { data: JSON.parse(fileBody) } });
      console.debug(data.statusCode);
    } catch (e) {
      console.error(e);
    }
  });
  res.status(200).send('Data loaded in background !');
});

datasetRouter.put('/load/:db', async (req: Request, res: Response) => {
  if (req.params.db && req.body.data) {
    switch (req.params.db) {
      case 'band':
        if (await Dataset.loadBandFromVariable(req.params.db, req.body.data)) {
          res.status(200).send('Dataset successfully initialized !');
        } else {
          res.status(403).send('ERROR - BAD FORMAT ...');
        }
        break;

      case 'venue':
        if (await Dataset.loadVenueFromVariable(req.params.db, req.body.data)) {
          res.status(200).send('Dataset successfully initialized !');
        } else {
          res.status(403).send('ERROR - BAD FORMAT ...');
        }
        break;

      case 'concert':
        if (await Dataset.loadConcertFromVariable(req.params.db, req.body.data)) {
          res.status(200).send('Dataset successfully initialized !');
        } else {
          res.status(403).send('ERROR - BAD FORMAT ...');
        }
        break;

      default:
        res.status(400).send('ERROR - BAD DB FORMAT ...');
    }
  } else {
    res.status(401).send('ERROR - BAD FORMAT ...');
  }
});

export default datasetRouter;
