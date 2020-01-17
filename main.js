const fs = require("fs");
const template = require("./template");
const DOM = require("jsdom").JSDOM;

fs.readdir(`${__dirname}/icons`, (err, files) => {
  if (!err) {
    files.forEach(file => {
      const fileContent = fs.readFileSync(`${__dirname}/icons/${file}`, {
        encoding: "utf8"
      });
      if (fileContent) {
        const svgFile = new DOM(
          fileContent
            .replace(/width\=\"[\d]+\"/, ':width="width"')
            .replace(/height\=\"[\d]+\"/, ':height="height"')
        ).window.document.body;
        let fileName = file.replace(/ +/g, "_").replace(/.svg/g, "");
        fileName =
          fileName[0].toUpperCase() + fileName.substr(1, fileName.length);
        const config = {
          name: fileName,
          content: svgFile.innerHTML
        };
        const templateText = template(config);
        fs.writeFileSync(
          `${__dirname}/components/${config.name}.vue`,
          templateText
        );
        console.log(`${config.name}.vue Created!`);
      }
    });
    GenerateComponentsFile(files);
  }
});

function GenerateComponentsFile(files) {
  let componentList = "//componentList \n{";
  let importStateMents = "";
  files.forEach(file => {
    let fileName = file.replace(/ +/g, "_").replace(/.svg/g, "");
    fileName = fileName[0].toUpperCase() + fileName.substr(1, fileName.length);
    componentList += `"${fileName}":${fileName},`;
    importStateMents += `import ${fileName} from './icons/${fileName}.vue';\n`;
  });
  componentList += "}";
  const output = `${importStateMents}\n${componentList}`;
  fs.writeFileSync(`${__dirname}/components/cmpList.txt`, output);
}
