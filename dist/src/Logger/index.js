"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
// eslint-disable-file no-console
var chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ALL"] = -1] = "ALL";
    LogLevel[LogLevel["INFO"] = 0] = "INFO";
    LogLevel[LogLevel["DONE"] = 1] = "DONE";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
;
/**
 * Descriptive Logger class with colors
 * @constructor
 * @param {string} level - Set the log level to this instance
 */
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger(
    /**
   *  __ALL__ _(default)_: display all message types.
   *
   *  __INFO__: display only _INFO_ messages.
   *
   *  __DONE__: display only _DONE_ messages.
   *
   *  __WARN__: display only _WARN_ messages.
   *
   *  __ERROR__: display only _ERROR_ messages.
   */
    level) {
        if (level === void 0) { level = LogLevel.ALL; }
        this.level = level;
    }
    ConsoleLogger.prototype.info = function (message) {
        if (this.level === 0 || this.level === -1) {
            console.log(chalk_1.default.bgBlue.black('  INFO ') + "\t" + message);
        }
    };
    ;
    ConsoleLogger.prototype.done = function (message) {
        if (this.level === 1 || this.level === -1) {
            console.log(chalk_1.default.bgGreen.black('  DONE ') + "\t" + message);
        }
    };
    ;
    ConsoleLogger.prototype.warn = function (message) {
        if (this.level === 2 || this.level === -1) {
            console.log(chalk_1.default.bgYellow.black('  WARN ') + "\t" + message);
        }
    };
    ;
    ConsoleLogger.prototype.error = function (message) {
        if (this.level === 3 || this.level === -1) {
            console.error(chalk_1.default.bgRedBright.black(' ERROR ') + "\t" + message);
        }
    };
    ;
    return ConsoleLogger;
}());
exports.default = ConsoleLogger;
