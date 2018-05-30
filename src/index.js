import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import Application from './application';
import config from './config';

let app = Application(config);
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));


require('express-async-errors');
app.server.listen(process.env.PORT || config.port, async () => {
  console.log(`Started on port ${app.server.address().port}`);
});