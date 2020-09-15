// eslint-disable-file no-console
import chalk from 'chalk';
import { Logger } from './types';

export enum LogLevel {
  ALL= -1,
  INFO= 0,
  DONE= 1,
  WARN= 2,
  ERROR= 3
};
/**
 * Descriptive Logger class with colors
 * @constructor
 * @param {string} level - Set the log level to this instance
 */
class ConsoleLogger implements Logger {

  level: LogLevel;

  constructor(
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
  level: LogLevel = LogLevel.ALL,
) {
  this.level = level;
}

  info(message:string) {
    if (this.level === 0 || this.level === -1) {
      console.log(`${chalk.bgBlue.black('  INFO ')}\t${message}`);
    }
  };

  done(message:string) {
    if (this.level === 1 || this.level === -1) {
      console.log(`${chalk.bgGreen.black('  DONE ')}\t${message}`);
    }
  };

  warn (message: string) {
    if (this.level === 2 || this.level === -1) {
      console.log(`${chalk.bgYellow.black('  WARN ')}\t${message}`);
    }
  };

  error(message:string) {
    if (this.level === 3 || this.level === -1) {
      console.error(`${chalk.bgRedBright.black(' ERROR ')}\t${message}`);
    }
  };
}

export default ConsoleLogger;
