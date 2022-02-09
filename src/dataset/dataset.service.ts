import fs from 'fs';
import { mapSeries } from 'bluebird';
import Database from '../database/database.service';

require('dotenv').config();

type S = string;
type N = number;

const Dataset = {
  checkFileStatus: async (filePath: string): Promise<boolean> => {
    try {
      if (fs.existsSync(filePath)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  checkSelectedDb: async (db: string): Promise <boolean> => {
    const dbCheck = ['band', 'venue', 'concert'];

    if (dbCheck.includes(db)) {
      return true;
    }
    return false;
  },

  loadBandFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD BANDS, TOTAL COUNT => ${rows.length}`);
    await mapSeries(rows, async (entity: { id: string, name: string }) => {
      try {
        await Database.insertBand(entity.id, entity.name);
        return [true, ''];
      } catch (e) {
        console.error(e);
        return [false, entity.name];
      }
    });
    return true;
  },
  loadConcertFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD CONCERTS, TOTAL COUNT => ${rows.length}`);
    await mapSeries(rows, async (entity: { venueId: string, bandId: string, date: string }) => {
      try {
        Database.insertConcert(entity.venueId, entity.bandId, entity.date);
        return true;
      } catch (e) {
        console.error(`ERROR IN loadConcertFromVariable => ${e}`);
        return false;
      }
    });
    return true;
  },
  loadVenueFromVariable: async (db: string, rows: any): Promise<boolean> => {
    console.info(`TRYING TO LOAD VENUES, TOTAL COUNT => ${rows.length}`);
    await mapSeries(rows, async (el: { id: S, name: S, latitude: N, longitude: N }) => {
      try {
        await Database.insertVenue(el.id, el.name, el.latitude, el.longitude);
        return [true, ''];
      } catch (e) {
        console.error(`ERROR IN loadVenueFromVariable => ${e}`);
        return [false, el.name];
      }
    });
    return true;
  },
};

export default Dataset;
