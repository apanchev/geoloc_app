import {Request, Response, Router as router} from 'express';
// import * as bluebird from 'bluebird';
import {Database} from './database.service';

export const databaseRouter = router();

databaseRouter.get('/initialize', async (req: Request, res: Response) => {
  const db = await Database.initialize();

  if (db) {
    res.status(200).send('Database successfully initialized !');
  } else {
    res.status(500).send(`Can't initialize database ...`);
  }
});

databaseRouter.get('/destroy', async (req: Request, res: Response) => {
  const db = await Database.destroy();

  if (db) {
    res.status(200).send('Dropped database successfully !');
  } else {
    res.status(500).send(`Error, can't drop database ...`);
  }
});

