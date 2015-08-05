
var util = require('util');

var ContinueSave = (function(){
    function ContinueSave(){
        ContinueSave.super_.call(this, {
            name: 'Continue Save'
        });
    }
    util.inherits(ContinueSave, rpglib.io.Interface);

    return ContinueSave;
})();

module.exports = new ContinueSave();
