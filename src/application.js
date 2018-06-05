import express from 'express';
import initializeDb from './utils/db';
import initializeServices from './routes';
import loadHandlers from './handlers'
import Boot from './utils/Boot';

/* securitize - takes the configuration and adds to endpoints the app token validation 
*  with the model I can validate user session token also
*/
const securitize = ({models, app}) => {
  app.use((req, res, next) => {
    const token = req.headers['token'];
    if (token === process.env.TOKEN) {
      return next()
    }
    res.status(403) // No token
   .send('forbidden');
    /* const token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'];
    req.userData = null;
    if (token === '' || token === undefined || token === null) return next();
    return models.User.getDataByToken(token)
    .then((data) => {
      req.userData = data;
      return next();
    })
    .catch(() => next()); */
  });
}

/* Main app - this part of the system should access to all modules such as models and 
*  routes once, set them up and hook them to the application
*/
const Application = (settings) => {
    const app = express();
    Boot(app, settings);
    const models = initializeDb(settings); // get the models once, then hook the models to the services
    Promise.resolve(models).then((x)=>{
      const AppConfig = {models:x, app}
      // validate api token - if able I can validate user-session token here also
      securitize(AppConfig);
      const handlers = loadHandlers(AppConfig);
      AppConfig.handlers = handlers;
      initializeServices(AppConfig) //add the routes, and handlers indirectly
    }).catch( (err) => {
     throw(err)
    });
    return app;
}

export default Application;