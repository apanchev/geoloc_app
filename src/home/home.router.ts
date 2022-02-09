import { Request, Response, Router as router } from 'express';

const homeRouter = router();

homeRouter.get('/', async (req: Request, res: Response) => {
  res.render('home');
});

export default homeRouter;
