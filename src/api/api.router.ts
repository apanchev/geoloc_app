import { Request, Response, Router as router } from 'express';
import { Api } from './api.service';
const got = require('got');

export const apiRouter = router();

apiRouter.get('/', async (req: Request, res: Response) => {
  const url = `http://localhost:${process.env.PORT}/api/search`;
  const body = {
    bandIds: "50,69,10",
    latitude: 48.8814422,
    longitude: 112.3684356,
    radius: 50,
  }
  try {
    const data = await got.post(url, { json: body });
    console.debug(`RES STATUS CODE => ${data.statusCode}`);
    console.debug(`RES BODY => ${data.body}`);
    res.status(200);
  } catch (e) {
    // console.debug(`RES STATUS CODE => ${e.HTTPError}`);
    console.error(e);
    res.status(400);
  }
});

apiRouter.post('/search', async (req: Request, res: Response) => {
  let { bandIds, latitude, longitude, radius } = req.body;
  latitude = Number(latitude);
  longitude = Number(longitude);
  radius = Number(radius);
  console.debug(`${bandIds} | ${latitude} | ${longitude} | ${radius}`);
  console.debug(`${typeof(bandIds)} | ${typeof(latitude)} | ${typeof(longitude)} | ${typeof(radius)}`);
  const newBandIds = await Api.parseBandIds(bandIds);
  console.debug(`BANDIDS => ${newBandIds}`);
  console.debug(newBandIds);
  console.debug(typeof(newBandIds));
  let result;
  const check = await Api.checkParams(newBandIds, latitude, longitude, radius);

  switch (check) {
    case 1:
      result = await Api.searchWithAllParams(newBandIds, latitude, longitude, radius);
      res.status(200).json(result);
      break;
    case 2:
      result = await Api.searchWithGeoLoc(latitude, longitude, radius);
      res.status(200).json(result);
      break;
    case 3:
      result = await Api.searchWithBand(newBandIds);
      res.status(200).json(result);
      break;
    default:
      res.status(400).send("FORMATING ERROR ...");
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