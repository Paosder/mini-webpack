
        (function (modules) {
            function require(id) {
                const [fn, map] = modules[id];

                function localRequire(relativePath) {
                    return require(map[relativePath]);
                }

                const module = {
                    exports: {}
                };

                fn(localRequire, module, module.exports);

                return module.exports;
            }
            require('js_1');
        })({js_1: [
            function (require, module, exports) {
                "use strict";

var _message = require("./message.js");

console.log((0, _message.decorateName)('hello'));
            },
            {"./message.js":"js_2"},
        ],js_2: [
            function (require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateName = undefined;

var _name = require("./name.js");

var decorateName = exports.decorateName = function decorateName(decorator) {
  return decorator + ", " + _name.name + "!";
};
            },
            {"./name.js":"js_3"},
        ],js_3: [
            function (require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var name = exports.name = "David Kim";
            },
            {},
        ],});
    
