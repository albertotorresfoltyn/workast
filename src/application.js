import MongodbMemoryServer from 'mongodb-memory-server'; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './utils/db';
import initializeServices from './routes';

const Application = (settings) => {
    /* Main app - this part of the system should access to all modules such as models and 
    *  routes once, set them up and hook them to the application
    */
    const app = express();
    const models = initializeDb(settings); // get the models once, then hook the models to the services
    const AppConfig = {models, app}
    initializeServices(AppConfig)
    return app;
}

export default Application;

// Module dependencies
/*import Debug from 'debug';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import express from 'express';
import swaggerTools from 'swagger-tools';
import redis from 'redis';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import uuidv4 from 'uuid/v4';
import sha1 from 'sha1';
import helmet from 'helmet';
import moment from 'moment';
import Jimp from 'jimp';
import csv from 'csv';
import lodash from 'lodash';
import mongofire from 'mongofire';
import passport from 'passport';
import { RRule } from 'rrule';
import nodemailer from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import hbs from 'nodemailer-express-handlebars';
import gcs from '@google-cloud/storage';
import facebook from 'passport-facebook-token';
import twitter from 'passport-twitter-token';
import { Strategy as google } from 'passport-google-token';
import authtoken from 'authtoken';
// import authtoken from '../../apitoken';
import MainControllers from './controllers';
import UniversalLib from './lib/UniversalLib';
import Battles from './lib/battles';
import Missions from './lib/missions';
import MongoPage from './lib/mongopage';
import Goals from './lib/goals';
import Users from './lib/users';
import Accounts from './lib/accounts';
import Upload from './lib/upload';
import Mails from './lib/mails';
import config from './config';
import Boot from './boot';

const debug = Debug('ciom:application');

const redisClient = redis.createClient(config.connection.redis);

const getAPIRouters = ({ app, Controllers, swaggerDoc, settings }) => {
  debug('routers...');

  const options = {
    controllers: Controllers,
  };

  app.set('basePath', settings.basePath);

  function formatValidationError(req, res, next) {
    next();
    // return res.end(JSON.stringify(error));
  }

  const initMiddleWare = (mws, callback) => {
    debug('initializating middleware');

    app.use(mws.swaggerMetadata());
    app.use(mws.swaggerValidator(), formatValidationError);
    app.use(mws.swaggerRouter(options));

    app.use(mws.swaggerUi({
      apiDocs: `${settings.basePath}/api-docs`,
      swaggerUi: `${settings.basePath}/docs`,
    }));
    callback();
  };
  swaggerTools.initializeMiddleware(swaggerDoc, (swaggerMiddleware) => {
    initMiddleWare(swaggerMiddleware, () => console.info('swaggerTools loaded'));
  });
};

const Application = (settings) => {
  // Main app
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Access-Token, apikey,  X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') return res.end();

    if (req.headers && req.headers['x-forwarded-for']) {
      const parts = req.headers['x-forwarded-for'].split(',');
      req.realip = parts[0];
    } else {
      req.realip = req.ip;
    }
    return next();
  });

  apiModules.reduce((acc, module) => {
    const model = yaml.safeLoad(fs.readFileSync(path.join(__dirname, `/api/${module}.yaml`), 'utf8'));
    return lodash.merge(acc, model);
  }, swaggerDoc);


  const db = mongofire(settings.connection.mongodb.uri, settings.connection.mongodb.collections);
  const ApplicationObject = {
    app,
    db,
    redis: redisClient,
    utils: {
    },
    libs: {
      Jimp,
      csv,
      RRule,
      lodash,
      uuidv4,
      moment,
      fs,
      gcs,
      hbs,
      nodemailer,
      sendmailTransport,
      passport,
      sha1,
    },
    strategies: {
      facebook,
      twitter,
      google,
    },
    settings,
  };

  MongoPage(ApplicationObject);
  ApplicationObject.libs.Universal = new UniversalLib(ApplicationObject);
  ApplicationObject.libs.Goals = Goals(ApplicationObject);
  ApplicationObject.libs.Missions = new Missions(ApplicationObject);
  ApplicationObject.libs.Battles = Battles(ApplicationObject);
  ApplicationObject.libs.Users = Users(ApplicationObject);
  ApplicationObject.libs.Upload = Upload(ApplicationObject);
  ApplicationObject.libs.Accounts = Accounts(ApplicationObject);
  ApplicationObject.libs.Mails = new Mails(ApplicationObject);
  ApplicationObject.Controllers = MainControllers(ApplicationObject);
  swaggerDoc.host = settings.ENV === 'dev' ? `${settings.host}:${settings.port}` : settings.host;
  swaggerDoc.basePath = settings.basePath;
  ApplicationObject.swaggerDoc = swaggerDoc;
  getAPIRouters(ApplicationObject);
 
  // run Boot
  Boot(ApplicationObject);


  app.use(helmet());

  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));
  app.use(bodyParser.text());
  app.use(new authtoken({
    mongodb: db,
    startupMessage: 'initializating api control',
    redis,
    excludes: ['/service/docs', '/service/api-docs'],
  }));
  app.use(expressValidator());

  // MWS for x-access-token
  app.use((req, res, next) => {
    const token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'];
    req.userData = null;
    if (token === '' || token === undefined || token === null) return next();
    return ApplicationObject.libs.Users.getDataByToken(token)
    .then((data) => {
      req.userData = data;
      console.info('has valid token! ', data, token);
      return next();
    })
    .catch(() => next());
  });


  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(() => {});

  passport.use(new twitter({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
  },
  (token, tokenSecret, profile, cb) => cb(null, profile)));

  return app;
};

module.exports = Application;
*/