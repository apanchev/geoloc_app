import mysql from 'mysql2/promise';
import { ParameterStatusMessage } from 'pg-protocol/dist/messages';
import { Database } from '../database/database.service';

require('dotenv').config()

const globalSql = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_BASE
});

export const Api = { 
  bandIdsValidator: (val: number[] | undefined): number => {
    if (typeof(val) === "object" && val.length) {
      return 1
    } else {
      return 2;
    }
  },
  latitudeValidator: (val: number | undefined): number => {
    console.debug(`LATITUDE TYPE => ${typeof(val)}`);
    if (typeof(val) === 'number') {
      if (val >= -90 && val <= 90) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 2;
    }
  },
  longitudeValidator: (val: number | undefined): number => {
    if (typeof(val) === 'number') {
      if (val >= -180 && val <= 180) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 2;
    }
  },
  radiusValidator: (val: number | undefined): number => {
    if (typeof(val) === 'number') {
      if (val >= 0 && val <= 6371) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 2;
    }
  },
  
    parseBandIds: async (bandIds: string | Array <string>): Promise <number[]> => {
      let arrayStr: Array<string>;
      let result: Array<number>;
  
      if (typeof(bandIds) == "string") {
        arrayStr = bandIds.split(",").map(i => i.trim());
        result = arrayStr.map(el => Number(el));
        result = result.filter((n) => {return n});
      } else if (typeof(bandIds) == "object") {
        result = bandIds.map(el => Number(el));
      } else {
        result = [];
      }
      console.debug(result);
      return result;
    },

  checkParams: async (bandIds: number[] | undefined, latitude: number | undefined, longitude: number | undefined, radius: number | undefined): Promise<number> => {
    const checkBands = Api.bandIdsValidator(bandIds);
    const checkLatitude = Api.latitudeValidator(latitude);
    const checkLongitude = Api.longitudeValidator(longitude);
    const checkRadius = Api.radiusValidator(radius);
    console.debug(`${checkBands} - ${checkLatitude} - ${checkLongitude} - ${checkRadius}`);

    if (checkBands == 1 && checkLatitude == 1 && checkLongitude == 1 && checkRadius == 1) {
      return 1;
    } else if (checkBands == 2 && checkLatitude == 1 && checkLongitude == 1 && checkRadius == 1) {
      return 2;
    } else if (checkBands == 1 && checkLatitude == 2 && checkLongitude == 2 && checkRadius == 2) {
      return 3;
    } else {
      return 0;
    }
  },

  getTotalBand: async (): Promise<string> => {
    try {
      const qry = 'SELECT count(*) as c FROM application.band;';

      const bandRes = await globalSql.execute(qry);
      let tmpRes: any = bandRes;

      return tmpRes[0][0].c;
    } catch (e) {
      return "-1";
    }
  },
  getTotalConcert: async (): Promise<string> => {
    try {
      const qry = 'SELECT count(*) as c FROM application.concert;';

      const concertRes = await globalSql.execute(qry);
      let tmpRes: any = concertRes;

      return tmpRes[0][0].c;
    } catch (e) {
      return "-1";
    }
  },
  getTotalVenue: async (): Promise<string> => {
    try {
      const qry = 'SELECT count(*) as c FROM application.venue;';

      const venueRes = await globalSql.execute(qry);
      let tmpRes: any = venueRes;

      return tmpRes[0][0].c;
    } catch (e) {
      return "-1";
    }
  },

  searchWithBand: async (bandIds: number[]): Promise <object> => {
    const result = Database.dbSearchWithBand(bandIds);
    return result;
  },

  radiansToDegres: (rad: number) : number => { return rad * (180 / Math.PI); },
  degresToRadians: (deg: number) : number => { return deg * (Math.PI / 180); },

  geolocGetBoundaries: (latitude: number, longitude: number, radius: number) : { latitudeMin: number, latitudeMax: number, longitudeMin: number, longitudeMax: number } => {
    const r = radius / 6371;
    let latitudeMin = latitude - Api.radiansToDegres(r);
    let latitudeMax = latitude + Api.radiansToDegres(r);
    let longitudeMin, longitudeMax = 0;
    console.debug(`radius => ${radius} | longitude => ${longitude} | latitude => ${latitude}`);
    console.debug(`latitudeMin => ${latitudeMin} | latitudeMax => ${latitudeMax}`);

    if (latitudeMin > -90 && latitudeMax < 90) {
      console.debug("GEOLOC IN IF ...");
      const delta = Math.asin(Math.sin(r) / Math.cos(Api.degresToRadians(latitude)));
      const sinR = Math.sin(r);
      console.debug(`sinR => ${sinR} | typeof ${typeof(sinR)}`);
      console.debug(`Math.sin(r) => ${Math.sin(r)} | Math.cos(latitude) ${Math.cos(Api.degresToRadians(latitude))} | ${Math.sin(r) / Math.cos(latitude)}`);
      longitudeMin = longitude - Api.radiansToDegres(delta);
      console.debug(`r => ${r.toFixed(10)} | DELTA => ${delta} | longitudeMin => ${longitudeMin}`);
      if (longitudeMin < -180) {
        longitudeMin += Api.radiansToDegres(Math.PI * 2);
      }
      longitudeMax = longitude + Api.radiansToDegres(delta);
      if (longitudeMax > 180) {
        console.debug(`longitudeMax > 180 => sub ${Api.radiansToDegres(Math.PI * 2)}`);
        longitudeMax -= Api.radiansToDegres(Math.PI * 2);
      }
      console.debug(`longitude => ${longitudeMin} - ${longitudeMax}`);
      console.debug(`latitude => ${latitudeMin} - ${latitudeMax}`);
    } else {
      console.debug("GEOLOC IN ELSE ...");
      latitudeMin = Math.max(latitudeMin, -90);
      latitudeMax = Math.min(latitudeMax, 90);
      longitudeMin = -180;
      longitudeMax = 180;
    }
    return { "latitudeMin": latitudeMin, "latitudeMax": latitudeMax, "longitudeMin": longitudeMin, "longitudeMax": longitudeMax };
  },

  searchWithGeoLoc: async (latitude: number, longitude: number, radius: number): Promise <object> => {
    const { latitudeMin, latitudeMax, longitudeMax, longitudeMin } = Api.geolocGetBoundaries(latitude, longitude, radius);
    console.debug(`COORDONEE => ${latitudeMin} | ${latitudeMax} | ${longitudeMin} | ${longitudeMax}`);
    const dbRes = await Database.dbSearchWithGeoloc(latitudeMin, latitudeMax, longitudeMin, longitudeMax);

    return dbRes;
  },

  searchWithAllParams: async (bandIds: number[], latitude: number, longitude: number, radius: number): Promise <object> => {
    const { latitudeMin, latitudeMax, longitudeMax, longitudeMin } = Api.geolocGetBoundaries(latitude, longitude, radius);
    const dbRes = await Database.dbSearchWithAll(bandIds, latitudeMin, latitudeMax, longitudeMin, longitudeMax);

    return dbRes;
  },
};
