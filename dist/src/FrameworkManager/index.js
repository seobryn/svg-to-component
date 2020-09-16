"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../frameworks/index"));
var FrameworkManager = /** @class */ (function () {
    function FrameworkManager(logger, rules) {
        this.logger = logger;
        this.rules = rules;
        this.baseDir = process.cwd();
    }
    FrameworkManager.prototype.use = function (framework) {
        var supportedFrameworks = this.rules.supportedFrameworks;
        console.log(this.rules);
        if (supportedFrameworks.includes(framework)) {
            this.logger.info("Using " + framework + " to build Icon Components");
            return new index_1.default[framework](this.logger, this.rules);
        }
        else {
            throw new Error(framework + " is not supported yet.");
        }
    };
    return FrameworkManager;
}());
exports.default = FrameworkManager;
/**
 *
 * const frameworks = {
  vue (files, configFile) {
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
  react (files, configFile) {
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

module.exports = frameworks;

 */ 
