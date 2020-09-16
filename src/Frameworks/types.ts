import { Config } from "../../types";

export interface Framework {
    name: string;
    run( config:Config): void;
}

export enum VUE_STATIC_TAGS {
    TEMPLATE_HTML='TEMPLATE_HTML',
    COMPONENT_NAME='COMPONENT_NAME',
    PROPS_CONTENT='PROPS_CONTENT',
}