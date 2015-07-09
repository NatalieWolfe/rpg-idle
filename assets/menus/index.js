
var fs = require('fs');
var path = require('path');

exports.name = "Main Menu";
var options = exports.options = [];

var menuDir = path.dirname(module.filename);
fs.readdirSync(menuDir).forEach(function(file){
    if (file != 'index.js') {
        options.push(require(path.join(menuDir, file)));
    }
});
