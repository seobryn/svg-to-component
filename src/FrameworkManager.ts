import { FrameworkType } from "../types";
import { Framework } from "./Frameworks/types";
import Vue from "./Frameworks/Vue";
import React from "./Frameworks/React";
import { CliOptions } from "../cli";

export default class FrameworkManager {
    private static _instance: FrameworkManager;

    private constructor(){
    }

    public static get instance(): FrameworkManager {
        if(!this._instance){
            this._instance = new FrameworkManager();
        }
        return this._instance;
    }

    use(options: CliOptions): Framework {
        const basePath = process.cwd();
        switch(options.f as FrameworkType){
            case 'Vue':
                return new Vue(basePath, options);
            case 'React':
                return new React(basePath, options);
        }
    }

}