import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
/* Boots express application with essential utils */

export default (app, settings) => {
  const logger = morgan('dev');
  // logger
  app.use(logger);

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With, X-Access-Token, apikey,  X-Requested-With'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') return res.end();

    if (req.headers && req.headers['x-forwarded-for']) {
      const parts = req.headers['x-forwarded-for'].split(',');
      req.realip = parts[0];
    } else {
      req.realip = req.ip
    }
    return next();
  });

  // 3rd party middleware
  app.use(
    cors({
      exposedHeaders: settings.corsHeaders
    })
  );

  app.use(helmet());

  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  // parse application/json
  app.use(
    bodyParser.json({
      limit: settings.bodyLimit
    })
  );

  return app;
}
