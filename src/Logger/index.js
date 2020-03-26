// eslint-disable-file no-console
const chalk = require('chalk');

const logLevel = {
  ALL: -1,
  INFO: 0,
  DONE: 1,
  WARN: 2,
  ERROR: 3
};
/**
 * Descriptive Logger class with colors
 * @constructor
 * @param {string} level - Set the log level to this instance
 */
function Logger (
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
  level = 'ALL'
) {
  const $vm = this;
  $vm.level = level.toUpperCase().trim();

  $vm.info = function info (message) {
    if (logLevel[$vm.level] === 0 || logLevel[$vm.level] === -1) {
      console.log(`${chalk.bgBlue.black('  INFO ')}\t${message}`);
    }
  };

  $vm.done = function done (message) {
    if (logLevel[$vm.level] === 1 || logLevel[$vm.level] === -1) {
      console.log(`${chalk.bgGreen.black('  DONE ')}\t${message}`);
    }
  };

  $vm.warn = function warn (message) {
    if (logLevel[$vm.level] === 2 || logLevel[$vm.level] === -1) {
      console.log(`${chalk.bgYellow.black('  WARN ')}\t${message}`);
    }
  };

  $vm.error = function error (message) {
    if (logLevel[$vm.level] === 3 || logLevel[$vm.level] === -1) {
      console.error(`${chalk.bgRedBright.black(' ERROR ')}\t${message}`);
    }
  };

  if (!($vm instanceof Logger)) {
    this.error('use the logger with new keyword!');
    throw new Error('use the logger with new keyword!');
  }
}

module.exports = Logger;
