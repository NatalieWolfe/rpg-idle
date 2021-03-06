#! /usr/bin/env node

var pkg = require('./package');
var io = require('./lib/interface');

global.rpglib = {
    io: io,
    pkg: pkg
};

console.log('Welcome to Idle RPG v' + pkg.version);
console.log('');

var main = io.create(require('./assets/menus'));
console.log(main.name);

main.run()
    .then(function(){
        console.log('Thanks for visiting!');
    }, function(err){
        console.error('Error:', err);
        console.error(err.stack);
    });
