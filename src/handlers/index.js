import morgan from 'morgan';
/** 
 * get all handlers in an object... 
 */
export default (AppConfig) => {
    const fs = require('fs');
    const handlers = {};
    // same trick different parametrization
    fs.readdirSync(__dirname).forEach(function(file) {
      if (file !== 'index.js') {
        const handlerName = file.split('.')[0];
        const protoHandler =  require('./' + handlerName);
        const handler = protoHandler.default(AppConfig);
        handlers[handlerName] = handler;
      }
    });
    return handlers;
  }