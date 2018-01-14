"use strict";
exports.__esModule = true;
var path = require("path");
var ncp = require("ncp");
var moveUrl = [
    '/src/keys'
];
var destinationUrl = 'dist';
var MoveFile = /** @class */ (function () {
    function MoveFile() {
        this.movefile();
    }
    MoveFile.prototype.movefile = function () {
        moveUrl.forEach(function (url) {
            console.log("copy \"" + path.join(url) + "\" => \"" + path.join(destinationUrl, url) + "\" ...");
            ncp(path.join(__dirname, url), path.join(__dirname, destinationUrl, path.basename(url)), function (err) {
                if (err) {
                    console.error('Move fail');
                    return console.error(err);
                }
                console.error('Move success');
            });
        });
        console.log('Move Done!');
    };
    return MoveFile;
}());
exports.MoveFile = MoveFile;
module.exports = new MoveFile();
