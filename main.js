const fs = require('fs');
const vueTemplate = require('./src/templates/vue');
const config = require('./props.json');

const frameworkType = process.argv.pop();

console.info(`\x1b[32m[SVG]:\x1b[0m Using ${frameworkType} to transform`);

const frameworks = {
  vue(files){
    files.forEach(file=>{
      if(config.ignoredFiles.indexOf(file) === -1){
        const fileContent = fs.readFileSync(`${__dirname}/icons/${file}`, {
          encoding: 'utf8'
        });
        if(fileContent){
          vueTemplate
            .transform({fileContent, fileName: file.replace(/ +/g, '_').replace(/.svg/g, '')})
            .then(logInfo=>{
              if(logInfo){
                console.info(logInfo);
              }
            })
            .catch(error=>{
              console.error(`\x1b[31m[SVG]:\x1b[0m An Error Ocurred -> ${error}`);
            });
        }
      }
    });
    vueTemplate.save(files);
  }
};

fs.readdir(`${__dirname}/icons`, (err, files) => {
  if (!err) {
    frameworks[frameworkType](files,config);
  }
});
