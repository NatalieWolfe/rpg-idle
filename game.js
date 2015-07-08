#! node

var pkg = require('./package');
var io = require('./lib/interface');

console.log('Welcome to Idle RPG v' + pkg.version);

var main = io.create('main');

main.run()
    .then(function(){
        console.log('Thanks for visiting!');
    }, function(err){
        console.error('Error:', err);
        console.error(err.stack);
    });
