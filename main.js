const fs = require('fs');
const config = require('./props.json');
const Logger = require('./src/Logger');
const frameworks = require('./src/FrameworkManager');

const logger = new Logger();

const frameworkType = process.argv.pop();

logger.info(`Using ${frameworkType} to transform`);

try {
  fs.readdir(`${__dirname}/icons`, (err, files) => {
    if (!err) {
      frameworks[frameworkType](files, config);
    } else {
      throw new Error(`You have to put your svg icons inside ${__dirname}/icons folder.`);
    }
  });
} catch (err) {
  logger.error(err.message);
}
