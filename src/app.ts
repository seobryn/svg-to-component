import fs from 'fs';
import config from '../props.json';
import ConsoleLogger from './Logger';

import FrameworkManager from './FrameworkManager';
import { FMConfig, FrameworkType } from './FrameworkManager/types';

const logger = new ConsoleLogger();
const manager = new FrameworkManager(logger);
manager.configure(config as FMConfig);

const frameworkType = process.argv.pop() as FrameworkType;
const framework = manager.use(frameworkType);

try {
  fs.readdir(`${__dirname}/icons`,async (err, files) => {
    if (!err) {
      const validation = await framework.transform(files);
      console.log(validation);
    } else {
      throw new Error(`You have to put your svg icons inside ${__dirname}/icons folder.`);
    }
  });
} catch (err) {
  logger.error(err.message);
}
