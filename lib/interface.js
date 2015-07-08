
var _       = require('underscore');
var path    = require('path');

var Interface = (function(){
    function Interface(opts){
        this._menu = _loadMenu(opts);
    }

    Interface.prototype.print = function(){
        if (this._menu.options) {
            var i = 0;
            this._menu.options.forEach(function(opt){
                console.log('  ' + (++i) + '. ' + opt.name);
            });
        }
    };

    Interface.prototype.getInput = function(){
        process.stdout.write('> ');
        return _getLine.call(this);
    };

    Interface.prototype.choose = function(choice){
        var option = this._menu.options[choice];
        if (!option) {
            throw new Error('Unknown option "' + choice + '"');
        }

        if (option instanceof Interface) {
            return option.run();
        }
        else {
            return option();
        }
    };

    Interface.prototype.run = function(){
        var self = this;
        this.print();
        return this.getInput()
            .then(function(choice){
                return self.choose(parseInt(choice, 10) - 1);
            })
            .then(function(cont){
                if (cont) {
                    return self.run();
                }
            });
    };

    /**
     * Loads the provided interface options, potentially fetching them from the
     * assets directory.
     *
     * @private
     *
     * @param {string|Array} opts
     */
    function _loadMenu(opts){
        opts = _optsFromString(opts);

        if (opts.options) {
            opts.options = opts.options.map(function(opt){
                return _optsFromString(opt);
            });
        }

        return opts;
    }

    /**
     * @private
     */
    function _optsFromString(opt){
        if (_.isString(opt)) {
            return require(path.join('../assets/menus', opt));
        }
        return opt;
    }

    return Interface;
})();

exports.create = function createInterface(opts){
    return new Interface(opts);
};
