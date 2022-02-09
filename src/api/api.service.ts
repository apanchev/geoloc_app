import Database from '../database/database.service';

require('dotenv').config();

type N = number;
type NumUn = number | undefined;
type NumArrUn = number[] | undefined;

const Api = {
  bandIdsValidator: (val: number[] | undefined): number => {
    if (typeof (val) === 'object' && val.length) {
      return 1;
    }
    return 2;
  },
  latitudeValidator: (val: number | undefined): number => {
    if (typeof (val) === 'number') {
      if (val >= -90 && val <= 90) {
        return 1;
      }
      return 0;
    }
    return 2;
  },
  longitudeValidator: (val: number | undefined): number => {
    if (typeof (val) === 'number') {
      if (val >= -180 && val <= 180) {
        return 1;
      }
      return 0;
    }
    return 2;
  },
  radiusValidator: (val: number | undefined): number => {
    if (typeof (val) === 'number') {
      if (val >= 0 && val <= 6371) {
        return 1;
      }
      return 0;
    }
    return 2;
  },

  parseBandIds: async (bandIds: string | Array <string>):
  Promise <number[]> => {
    let arrayStr: Array<string>;
    let result: Array<number>;

    if (typeof bandIds === 'string') {
      arrayStr = bandIds.split(',').map((i) => i.trim());
      result = arrayStr.map((el) => Number(el));
      result = result.filter((n) => n);
    } else if (typeof bandIds === 'object') {
      result = bandIds.map((el) => Number(el));
    } else {
      result = [];
    }
    return result;
  },

  checkParams: async (bandIds: NumArrUn, lat: NumUn, lon: NumUn, rad: NumUn):
  Promise<number> => {
    const checkB = Api.bandIdsValidator(bandIds);
    const checkLa = Api.latitudeValidator(lat);
    const checkLo = Api.longitudeValidator(lon);
    const checkRa = Api.radiusValidator(rad);
    console.debug(`${checkB} - ${checkLa} - ${checkLo} - ${checkRa}`);

    if (checkB === 1 && checkLa === 1 && checkLo === 1 && checkRa === 1) {
      return 1;
    } if (checkB === 2 && checkLa === 1 && checkLo === 1 && checkRa === 1) {
      return 2;
    } if (checkB === 1 && checkLa === 2 && checkLo === 2 && checkRa === 2) {
      return 3;
    }
    return 0;
  },

  searchWithBand: async (bandIds: number[]): Promise <object> => {
    const result = Database.dbSearchWithBand(bandIds);
    return result;
  },

  radiansToDegres: (rad: number) : number => rad * (180 / Math.PI),
  degresToRadians: (deg: number) : number => deg * (Math.PI / 180),

  geolocGetBoundaries: (la: N, lo: N, ra: N):
  { laMin: N, laMax: N, loMin: N, loMax: N } => {
    const r = ra / 6371;
    let laMin = la - Api.radiansToDegres(r);
    let laMax = la + Api.radiansToDegres(r);
    let loMin = 0;
    let loMax = 0;

    if (laMin > -90 && laMax < 90) {
      const preDelta = Math.sin(r) / Math.cos(Api.degresToRadians(la));
      const delta = Math.asin(preDelta);
      loMin = lo - Api.radiansToDegres(delta);

      if (loMin < -180) {
        loMin += Api.radiansToDegres(Math.PI * 2);
      }
      loMax = lo + Api.radiansToDegres(delta);
      if (loMax > 180) {
        loMax -= Api.radiansToDegres(Math.PI * 2);
      }
    } else {
      laMin = Math.max(laMin, -90);
      laMax = Math.min(laMax, 90);
      loMin = -180;
      loMax = 180;
    }
    return {
      laMin, laMax, loMin, loMax,
    };
  },

  searchWithGeoLoc: async (la: N, lo: N, rad: N):
  Promise <object> => {
    const { laMin, laMax, loMin, loMax } = Api.geolocGetBoundaries(la, lo, rad);
    console.debug(`COORDONEE => ${laMin} | ${laMax} | ${loMin} | ${loMax}`);
    const dbRes = await Database.dbSearchWithGeoloc(laMin, laMax, loMin, loMax);

    return dbRes;
  },

  searchWithAllParams: async (bIds: number[], la: N, lo: N, rad: N):
  Promise <object> => {
    const {
      laMin, laMax, loMin, loMax,
    } = Api.geolocGetBoundaries(la, lo, rad);
    const d = await Database.dbSearchWithAll(bIds, laMin, laMax, loMin, loMax);

    return d;
  },
};

export default Api;
