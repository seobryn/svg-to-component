const fs = require('fs');
const vueTemplate = require('./src/templates/vue');
const reactTemplate = require('./src/templates/react');
const config = require('./props.json');
const Logger = require('./src/Logger');
const frameworks = require('./src/FrameworkManager');
const logger = new Logger();

const frameworkType = process.argv.pop();

logger.info(`Using ${frameworkType} to transform`);


fs.readdir(`${__dirname}/icons`, (err, files) => {
  if (!err) {
    frameworks[frameworkType](files, config);
  }
});
