const fs = require('fs');
const vueTemplate = require('./src/templates/vue');
const config = require('./props.json');
const Logger = require('./src/Logger');
const logger =  new Logger();

const frameworkType = process.argv.pop();

logger.error(`Using ${frameworkType} to transform`);

const frameworks = {
  vue(files ,configFile){
    files.forEach(file=>{
      if(configFile.ignoredFiles.indexOf(file) === -1){
        const fileContent = fs.readFileSync(`${__dirname}/icons/${file}`, {
          encoding: 'utf8'
        });
        if(fileContent){
          vueTemplate
            .transform({fileContent, fileName: file.replace(/ +/g, '_').replace(/.svg/g, '')})
            .then(logInfo=>{
              if(logInfo){
                logger.done(logInfo);
              }
            })
            .catch(error=>{
              logger.error(error);
            });
        }
      }
    });
    vueTemplate.save(files,configFile);
  }
};

fs.readdir(`${__dirname}/icons`, (err, files) => {
  if (!err) {
    frameworks[frameworkType](files,config);
  }
});
