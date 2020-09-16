"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReactTransform = /** @class */ (function () {
    function ReactTransform(logger, config) {
        this.logger = logger;
        this.config = config;
    }
    ReactTransform.prototype.transform = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    return ReactTransform;
}());
exports.default = ReactTransform;
/*
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
*/ 
