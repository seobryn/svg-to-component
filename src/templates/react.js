const DOM = require('jsdom').JSDOM;
const fs = require('fs');

const baseDir = `${__dirname}/../../components/react`;

const api = {
  transform (options) {
    return new Promise((resolve) => {
      const svgFile = new DOM(
        options.fileContent
          .replace(/width="[\d]+"/, 'width={width}')
          .replace(/height="[\d]+"/, 'height={height}')
      ).window.document.body;
      options.fileName =
                options.fileName[0].toUpperCase() + options.fileName
                  .substr(1, options.fileName.length);
      const config = {
        name: options.fileName,
        content: svgFile.innerHTML
      };
      const templateText = api.generateTemplate(config);

      fs.mkdirSync(`${baseDir}/${config.name}`, { recursive: true });
      fs.writeFileSync(
        `${baseDir}/${config.name}/index.jsx`,
        templateText
      );
      return resolve(`${config.name}/index.jsx Created!`);
    });
  },
  generateTemplate (config) {
    const content = api.prepareContent(config.content);
    return `
            import React from 'react';
            const svgIcon = ({color=["${content.defaultColor.join('","')}"],width,height})=>{
                return (
                    ${content.template.replace(/"{/g, '{').replace(/}"/g, '}')}
                );
            };

            export default svgIcon;
        `;
  },
  prepareContent (contentFile) {
    const output = {
      defaultColor: [],
      template: ''
    };
    let content = new DOM(contentFile).window.document.body;

    content = api.fixChildren(content, output);
    output.template = content.innerHTML;

    return output;
  },
  fixChildren (content, output) {
    for (let count = 0; count < content.children.length; count += 1) {
      let currentItem = content.children.item(count);

      if (currentItem.nodeName.toLowerCase() === 'path') {
        if (currentItem.getAttribute('fill')) {
          const posibleColor = output.defaultColor.indexOf(
            currentItem.getAttribute('fill')
          );
          if (posibleColor === -1) {
            output.defaultColor.push(currentItem.getAttribute('fill'));
            currentItem.setAttribute(
              'fill',
              `{color[${output.defaultColor.length - 1}]}`
            );
          } else {
            currentItem.setAttribute('fill', `{color[${posibleColor}]}`);
          }
        }

        if (currentItem.getAttribute('stroke')) {
          const posibleColor = output.defaultColor.indexOf(
            currentItem.getAttribute('stroke')
          );
          if (posibleColor === -1) {
            output.defaultColor.push(currentItem.getAttribute('stroke'));
            currentItem.setAttribute(
              'stroke',
              `{color[${output.defaultColor.length - 1}]}`
            );
          } else {
            currentItem.setAttribute('stroke', `{color[${posibleColor}]}`);
          }
        }
      } else if (
        currentItem.nodeName.toLowerCase() === 'g' ||
                currentItem.nodeName.toLowerCase() === 'mask' ||
                currentItem.nodeName.toLowerCase() === 'svg'
      ) {
        currentItem = api.fixChildren(currentItem, output);
      }
    }
    return content;
  },
  save (files, config) {
    let importStateMents = '';
    files.forEach((file) => {
      if (config.ignoredFiles.indexOf(file) === -1) {
        let fileName = file.replace(/ +/g, '_').replace(/.svg/g, '');
        fileName = fileName[0].toUpperCase() + fileName.substr(1, fileName.length);
        importStateMents += `export { default as ${fileName} } from './${fileName}';\n`;
      }
    });
    fs.writeFileSync(`${baseDir}/index.js`, importStateMents);
  }
};

module.exports = {
  transform: api.transform,
  save: api.save
};
