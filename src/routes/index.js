var fs = require('fs'),
    validFileTypes = ['js'];

var requireFiles = function (directory, AppConfig) {
  fs.readdirSync(directory).forEach(function (fileName) {
    // Recurse if directory
    if(fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      requireFiles(directory + '/' + fileName, AppConfig);
    } else {

      // Skip this file itself
      if(fileName === 'index.js' && directory === __dirname) return;

      // Skip all other filetypes
      if(validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;

      // Require the file.
      require(directory + '/' + fileName)(AppConfig);
    }
  })
}

module.exports = function (AppConfig) {
  requireFiles(__dirname, AppConfig);
}