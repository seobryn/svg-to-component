const fs = require('fs');
const vueTemplate = require('./src/templates/vue');
const reactTemplate = require('./src/templates/react');
const config = require('./props.json');
const Logger = require('./src/Logger');

const logger = new Logger();

const frameworkType = process.argv.pop();

logger.info(`Using ${frameworkType} to transform`);

const frameworks = {
  vue(files, configFile) {
    logger.info('Creating vue folder');
    if (!fs.existsSync('./components/vue')) {
      fs.mkdirSync('./components/vue', { recursive: true });
    }
    files.forEach((file) => {
      if (configFile.ignoredFiles.indexOf(file) === -1) {
        const fileContent = fs.readFileSync(`${__dirname}/icons/${file}`, {
          encoding: 'utf8'
        });
        if (fileContent) {
          vueTemplate
            .transform({ fileContent, fileName: file.replace(/ +/g, '_').replace(/.svg/g, '') })
            .then((logInfo) => {
              if (logInfo) {
                logger.done(logInfo);
              }
            })
            .catch((error) => {
              logger.error(error);
            });
        }
      }
    });
    vueTemplate.save(files, configFile);
  },
  react(files, configFile) {
    logger.info('Creating react folder');
    if (!fs.existsSync('./components/react')) {
      fs.mkdirSync('./components/react', { recursive: true });
    }
    files.forEach((file) => {
      if (configFile.ignoredFiles.indexOf(file) === -1) {
        const fileContent = fs.readFileSync(`${__dirname}/icons/${file}`, {
          encoding: 'utf8'
        });
        if (fileContent) {
          reactTemplate
            .transform({ fileContent, fileName: file.replace(/ +/g, '_').replace(/.svg/g, '') })
            .then((logInfo) => {
              if (logInfo) {
                logger.done(logInfo);
              }
            })
            .catch((error) => {
              logger.error(error);
            });
        }
      }
    });
    reactTemplate.save(files, configFile);
  }
};

fs.readdir(`${__dirname}/icons`, (err, files) => {
  if (!err) {
    frameworks[frameworkType](files, config);
  }
});
