
var events = require('events');
var util = require('util');

var StdIn = (function(){
    function StdIn(){
        StdIn.super_.call(this);

        this._lineBuffer = [];
        _bindStdIn.call(this);
    }
    util.inherits(StdIn, events.EventEmitter);

    StdIn.prototype.getLine = function(){
        if (this._lineBuffer.length) {
            return Promise.resolve(this._lineBuffer.shift());
        }

        var self = this;
        return new Promise(function(resolve, reject){
            self.once('line', function(){
                self.removeListener('error', reject);
                self.removeListener('close', reject);
                resolve(self._lineBuffer.shift());
            });
            self.once('error', reject);
            self.once('close', reject);
        });
    };

    function _bindStdIn(){
        var self = this;
        process.stdin.setEncoding('utf8');
        process.stdin.on('close', function(){ self.emit('close', new Error('Stream closed.')); });
        process.stdin.on('data', _handleChunk.bind(this));
        process.stdin.on('error', function(err){ self.emit('error', err); });
        this._readable = new Promise(function(resolve){ process.stdin.on('readable', resolve); });
    }

    function _handleChunk(data){
        var start = 0;
        for (var i in data) {
            if (i > start && data[i] == '\n') {
                var line = data.substring(start, i).trim();
                start = i + 1;

                if (line.length > 0) {
                    this._lineBuffer.push(line);
                    this.emit('line', line);
                }
            }
        }
    }

    return StdIn;
})();

module.exports = new StdIn();
