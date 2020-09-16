import { CliOptions } from "../../cli";
import { Config } from "../../types";
import { Framework } from "./types";

export default class React implements Framework {
    name: string;
    constructor(private basePath:string,private options: CliOptions){
        this.name = "React";
    }

    run(config: Config){
        
    }
}