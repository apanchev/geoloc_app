import {Request, Response, Router as router} from 'express';
// import {Event} from './events.service';

export const homeRouter = router();

homeRouter.get('/', async (req: Request, res: Response) => {
  res.render('home');
  // res.status(200).send("OKOK");
});
