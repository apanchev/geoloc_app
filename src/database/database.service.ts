import mysql from 'mysql2/promise';
require('log-timestamp')(() => { return `[${new Date().toLocaleString('fr-FR').replace('à', '-')}] %s` });

require('dotenv').config();

export const globalSql = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
});

type N = number;
type S = string;

const Database = {
  initialize: async (): Promise<boolean> => {
    try {
      const qryDb = `CREATE DATABASE ${process.env.DB_BASE}`;
      const qryBrand = `CREATE TABLE ${process.env.DB_BASE}.band (
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR (255) NOT NULL
      ) CHARSET=utf8`;
      const qryConcert = `CREATE TABLE ${process.env.DB_BASE}.concert (
        venueId INT NOT NULL,
        bandId INT NOT NULL,
        date BIGINT NOT NULL
      ) CHARSET=utf8`;
      const qryVenue = `CREATE TABLE ${process.env.DB_BASE}.venue (
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR (255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8`;
      console.info(`INITIALIZING DATABASE ...`);

      await globalSql.execute(qryDb);
      await globalSql.execute(qryBrand);
      await globalSql.execute(qryConcert);
      await globalSql.execute(qryVenue);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  destroy: async (): Promise<boolean> => {
    try {
      const qryDrop = `DROP DATABASE ${process.env.DB_BASE}`;

      await globalSql.execute(qryDrop);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  insertBand: async (id: string, name: string): Promise<boolean> => {
    try {
      const qry = `INSERT INTO ${process.env.DB_BASE}.band (id, name) VALUES (?, ?)`;

      await globalSql.execute(qry, [id, name]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  insertConcert: async (venueId: string, bandId: string, date: string): Promise<boolean> => {
    try {
      const qry = `INSERT INTO ${process.env.DB_BASE}.concert (venueId, bandId, date) VALUES (?, ?, ?)`;

      await globalSql.execute(qry, [venueId, bandId, date]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  insertVenue: async (id: S, name: S, latitude: S, longitude: S): Promise<boolean> => {
    try {
      const qry = `INSERT INTO ${process.env.DB_BASE}.venue (id, name, latitude, longitude) VALUES (?, ?, ? ,?)`;

      await globalSql.execute(qry, [id, name, latitude, longitude]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  dbSearchWithGeoloc: async (latitudeMin: N, latitudeMax: N, longitudeMin: N, longitudeMax: N):
  Promise<[]> => {
    try {
      let qrySearchWithGeoloc = `SELECT b.name as name, v.name as location, date, latitude, longitude FROM ${process.env.DB_BASE}.concert as c JOIN ${process.env.DB_BASE}.venue as v ON venueId = v.id JOIN ${process.env.DB_BASE}.band as b ON b.id = bandId WHERE (latitude >= ? AND latitude <= ?) AND (longitude >= ? AND longitude <= ?) ORDER BY c.date DESC`;
      const qryParams = [latitudeMin, latitudeMax, longitudeMin, longitudeMax];

      if (longitudeMax < longitudeMin) {
        qrySearchWithGeoloc = `SELECT b.name as name, v.name as location, date, latitude, longitude FROM ${process.env.DB_BASE}.concert as c JOIN ${process.env.DB_BASE}.venue as v ON venueId = v.id JOIN ${process.env.DB_BASE}.band as b ON b.id = bandId WHERE (latitude >= ? AND latitude <= ?) AND (longitude >= ? AND longitude <= 180) OR (longitude <= ? AND longitude >= -180) ORDER BY c.date DESC`;
      }
      const result = await globalSql.execute(qrySearchWithGeoloc, qryParams);
      const res: any = result;

      return res[0];
    } catch (e) {
      console.error(`ERROR: Can't SELECT from database.\n${e}`);
      return [];
    }
  },

  dbSearchWithAll: async (bandIds: number[], laMin: N, laMax: N, loMin: N, loMax: N):
  Promise<[]> => {
    try {
      let qrySearchWithAllParams = `SELECT b.name as name, v.name as location, date, latitude, longitude FROM ${process.env.DB_BASE}.concert as c JOIN ${process.env.DB_BASE}.venue as v ON venueId = v.id JOIN ${process.env.DB_BASE}.band as b ON b.id = bandId WHERE (latitude >= ? AND latitude <= ?) AND (longitude >= ? AND longitude <= ?) AND b.id IN (${bandIds.join(', ')}) ORDER BY c.date DESC`;

      if (loMax < loMin) {
        qrySearchWithAllParams = `SELECT b.name as name, v.name as location, date, latitude, longitude FROM ${process.env.DB_BASE}.concert as c JOIN ${process.env.DB_BASE}.venue as v ON venueId = v.id JOIN ${process.env.DB_BASE}.band as b ON b.id = bandId WHERE (latitude >= ? AND latitude <= ?) AND (longitude >= ? AND longitude <= 180) OR (longitude <= ? AND longitude >= -180) AND b.id IN (${bandIds.join(', ')}) ORDER BY c.date DESC`;
      }
      const dbRes = await globalSql.execute(qrySearchWithAllParams, [laMin, laMax, loMin, loMax]);
      const result: any = dbRes;
      console.debug(`FOUND ${result[0].length} RESULTS !`);

      return result[0];
    } catch (e) {
      console.error(`ERROR: Can't SELECT from database.\n${e}`);
      return [];
    }
  },

  dbSearchWithBand: async (bandIds: number[]): Promise<[]> => {
    try {
      const qryWithBands = `SELECT b.name as name, v.name as location, date, latitude, longitude FROM ${process.env.DB_BASE}.concert as c JOIN ${process.env.DB_BASE}.venue as v ON venueId = v.id JOIN ${process.env.DB_BASE}.band as b ON b.id = bandId WHERE b.id IN (${bandIds.join(', ')}) ORDER BY c.date DESC`;
      const dbRes = await globalSql.execute(qryWithBands);
      const result: any = dbRes;

      return result[0];
    } catch (e) {
      console.error(`ERROR: Can't SELECT from database.\n${e}`);
      return [];
    }
  },
};

export default Database;
