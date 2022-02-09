import { Request, Response, Router as router } from 'express';
import Api from './api.service';

const apiRouter = router();

apiRouter.post('/search', async (req: Request, res: Response) => {
  let {
    bandIds, latitude, longitude, radius,
  } = req.body;
  let result;
  latitude = Number(latitude);
  longitude = Number(longitude);
  radius = Number(radius);
  bandIds = await Api.parseBandIds(bandIds);
  const check = await Api.checkParams(bandIds, latitude, longitude, radius);

  switch (check) {
    case 1:
      result = await Api.searchWithAllParams(bandIds, latitude, longitude, radius);
      res.status(200).json(result);
      break;
    case 2:
      result = await Api.searchWithGeoLoc(latitude, longitude, radius);
      res.status(200).json(result);
      break;
    case 3:
      result = await Api.searchWithBand(bandIds);
      res.status(200).json(result);
      break;
    default:
      res.status(400);
  }
});

apiRouter.get('/get/bands', async (req: Request, res: Response) => {
  const bands = await Api.getTotalBand();
  res.send(String(bands));
});
apiRouter.get('/get/concerts', async (req: Request, res: Response) => {
  const concerts = await Api.getTotalConcert();
  res.send(String(concerts));
});
apiRouter.get('/get/venues', async (req: Request, res: Response) => {
  const venues = await Api.getTotalVenue();
  res.send(String(venues));
});

export default apiRouter;
