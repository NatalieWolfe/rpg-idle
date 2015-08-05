
var _       = require('underscore');
var path    = require('path');

var stdin   = require('./stdin');

var Interface = (function(){
    function Interface(opts){
        this._menu = _loadMenu(opts);
        this._specialCommands = {};
    }

    Interface.prototype.print = function(){
        if (this._menu.options) {
            var i = 0;
            this._menu.options.forEach(function(opt){
                console.log('  ' + (++i) + '. ' + opt.name);
            });
        }
        else {
            throw new Error('Menu "' + this._menu.name + '" is not printable.')
        }
    };

    Interface.prototype.getInput = function(){
        process.stdout.write('> ');
        return stdin.getLine();
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
                if (_globalCommands[choice]) {
                    return _globalCommands[choice].call(self);
                }
                if (self._specialCommands[choice]) {
                    return self._specialCommands[choice].call(self);
                }
                return self.choose(parseInt(choice, 10) - 1);
            })
            .then(function(cont){
                if (cont) {
                    return self.run();
                }
            });
    };

    Interface.prototype.addCommand = function(name, cmd){
        this._specialCommands[name] = cmd;
        return this;
    };

    Object.defineProperty(Interface.prototype, 'name', {
        get: function(){ return this._menu.name; }
    });

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
                return _.isFunction(opt) ? opt : new Interface(_optsFromString(opt));
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

    var _globalCommands = {
        // TODO: Add global commands here.
    };

    return Interface;
})();

exports.Interface = Interface;

exports.create = function createInterface(opts){
    return new Interface(opts);
};
