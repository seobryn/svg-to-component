const DOM = require('jsdom').JSDOM;
const fs = require('fs');
const baseDir = `${__dirname}/../../components/vue`;

const api = {
  transform({fileContent, fileName}){
    return new Promise((resolve)=>{
      const svgFile = new DOM(
        fileContent
          .replace(/width="[\d]+"/, ':width="width"')
          .replace(/height="[\d]+"/, ':height="height"')
      ).window.document.body;
      fileName =
        fileName[0].toUpperCase() + fileName.substr(1, fileName.length);
      const config = {
        name: fileName,
        content: svgFile.innerHTML
      };
      const templateText = (config);
      fs.writeFileSync(
        `${baseDir}/${config.name}.vue`,
        templateText
      );
      return resolve(`${config.name}.vue Created!`);
    });
  },
  generateTemplate(config){
    const content = this.prepareContent(config.content);
    return `
<template>
  ${content.template}
</template>
<script>
  export default {
  name: "${config.name.toLowerCase()}",
    props: {
      color: {
        type: Array,
        default: ()=>([${content.defaultColor.map(element => {
    return element ? `"${element}"` : '';
  })}])
      },
      width:{
        type: String,
        default:''
      },
      height:{
        type: String,
        default:''
      }
    }
  }
</script>`;
  },
  prepareContent(contentFile){
    let output = {
      defaultColor: [],
      template: ''
    };
    let content = new DOM(contentFile).window.document.body;
  
    content = this.fixChildren(content, output);
    output.template = content.innerHTML;
  
    return output;
  },
  fixChildren(content, output){
    for (let count = 0; count < content.children.length; count++) {
      let currentItem = content.children.item(count);
  
      if (currentItem.nodeName.toLowerCase() === 'path') {
        if (currentItem.getAttribute('fill')) {
          const posibleColor = output.defaultColor.indexOf(
            currentItem.getAttribute('fill')
          );
          if (posibleColor === -1) {
            output.defaultColor.push(currentItem.getAttribute('fill'));
            currentItem.setAttribute(
              ':fill',
              `color[${output.defaultColor.length - 1}]`
            );
          } else {
            currentItem.setAttribute(':fill', `color[${posibleColor}]`);
          }
          currentItem.removeAttribute('fill');
        }
        
        if (currentItem.getAttribute('stroke')) {
          const posibleColor = output.defaultColor.indexOf(
            currentItem.getAttribute('stroke')
          );
          if (posibleColor === -1) {
            output.defaultColor.push(currentItem.getAttribute('stroke'));
            currentItem.setAttribute(
              ':stroke',
              `color[${output.defaultColor.length - 1}]`
            );
          } else {
            currentItem.setAttribute(':stroke', `color[${posibleColor}]`);
          }
          currentItem.removeAttribute('stroke');
        }
      } else if (
        currentItem.nodeName.toLowerCase() === 'g' ||
        currentItem.nodeName.toLowerCase() === 'mask' ||
        currentItem.nodeName.toLowerCase() === 'svg'
      ) {
        currentItem = this.fixChildren(currentItem, output);
      }
    }
    return content;
  },
  save(files,config){
    let componentList = '{';
    let importStateMents = '';
    files.forEach(file => {
      if(config.ignoredFiles.indexOf(file) === -1){
        let fileName = file.replace(/ +/g, '_').replace(/.svg/g, '');
        fileName = fileName[0].toUpperCase() + fileName.substr(1, fileName.length);
        componentList += `"${fileName}":${fileName},`;
        importStateMents += `import ${fileName} from './icons/${fileName}.vue';\n`;
      }
    });
    componentList += '}';
    const output = `${importStateMents}\n${componentList}`;
    fs.writeFileSync(`${baseDir}/cmpList.txt`, output);
  }
};

module.exports = {
  transform: api.transform,
  save: api.save
};