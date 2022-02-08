import fs from 'fs';
import {mapSeries} from 'bluebird';
import { datasetRouter } from './dataset.router';
import {Database} from '../database/database.service';

// import * as dotenv from 'dotenv';
require('dotenv').config();

export const Dataset = {
  checkFileStatus: async (filePath: string): Promise<boolean> => {
    try {
      if (fs.existsSync(filePath)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  checkSelectedDb: async (db: string): Promise <boolean> => {
    const dbCheck = ['band', 'venue', 'concert'];

    if (dbCheck.includes(db)) {
      return true;
    } else {
      return false;
    }
  },

  loadBandFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD BANDS, TOTAL COUNT => ${rows.length}`);
    const map = await mapSeries(rows, async (entity: { id: string, name: string }) => {
      try {
        await Database.insertBand(entity.id, entity.name);
        return [true, ""];
      } catch (e) {
        console.error(e);
        return [false, entity.name];
      }
    });
    return true;
  },
  loadConcertFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD CONCERTS, TOTAL COUNT => ${rows.length}`);
    const map = await mapSeries(rows, async (entity: { venueId: string, bandId: string, date: string }) => {
      try {
        // console.debug(`ENTITY ===> ${entity}`);
        Database.insertConcert(entity.venueId, entity.bandId, entity.date);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    });
    return true;
  },
  loadVenueFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD VENUES, TOTAL COUNT => ${rows.length}`);
    const map = await mapSeries(rows, async (entity: { id: string, name: string, latitude: string, longitude: string, }) => {
      try {
        await Database.insertVenue(entity.id, entity.name, entity.latitude, entity.longitude);
        return [true, ""];
      } catch (e) {
        console.error(e);
        return [false, entity.name];
      }
    });
    return true;
  },
};
