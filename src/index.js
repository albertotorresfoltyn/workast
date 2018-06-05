import http from 'http';
import Application from './application';
import config from './config';

try {
let app = Application(config);
  app.server = http.createServer(app);
  require('express-async-errors');
  app.server.listen(process.env.PORT || config.port, async () => {
    console.info(`Started on port ${app.server.address().port}`);
  });
} catch (err) {
  process.error(err);
}