/** 
 * Get the config and return all models connected properly
 */
export default (mongoose) => {
  const fs = require('fs');
  const modules = {};
  // initializes all models and sources them as .model-name
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file !== 'index.js') {
      const moduleName = file.split('.')[0];
      const preModule =  require('./' + moduleName);
      const module = preModule(mongoose);
      modules[moduleName] = module;
    }
  });
  return modules;
}
/**
 * Now you can call all your models as follows:
 */
/*
var models = require('./path/to/models');
var User = models.user;
var OtherModel = models['other-model'];*/