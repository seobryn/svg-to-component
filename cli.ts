import yargs from 'yargs';
import FrameworkManager from './src/FrameworkManager';
import { Config } from './types';


export interface CliOptions {
        [x: string]: unknown;
        f: string;
        iF?: string;
        oD?: string;
        _: string[];
        $0: string;
}

export default class Cli {
    private options?: CliOptions;

    constructor(private config: Config, private manager: FrameworkManager){
    }

    private transformCmd():void {
        const transformer = this.manager.use(this.options!);
        transformer.run(this.config);
    }

    start():void {
        this.options = yargs.usage('Usage: -f <Framework>')
            .option('f', { alias:'framework', describe: `Supported frameworks: [${this.config.supportedFrameworks.join(' | ')}]`, type: 'string', demandOption: true})
            .option('iF', { alias:'iconsFolder', describe: 'set custom SVG icon folder, [icons] default.', type: 'string' })
            .option('oD', { alias:'outputDirs', describe: 'set custom Framework components folder, [components] default.', type: 'string' })
            .argv;
        this.transformCmd();
    }
}