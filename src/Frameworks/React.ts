import { CliOptions } from "../../cli";
import { Config } from "../../types";
import { Framework, REACT_STATIC_TAGS } from "./types";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import Path from 'path';
import { JSDOM } from 'jsdom';

import template from './Templates/reactTemplate.html'

interface PropsType {
    [key: string]: any,
}

export default class React implements Framework {
    private config?: Config;
    private iconsFolder?: string;
    name: string;
    constructor(private basePath: string, private options: CliOptions) {
        this.name = "React";
    }

    run(config: Config): void {
        this.config = config;
        const files = this.loadFiles();
        if (files.length > 0) {
            mkdirSync(`${this.basePath}/${this.options.oD || 'components'}/${this.name}`, { recursive: true });
            const vueFiles = files.map(file => {
                return {
                    fileName: file.split('/').pop()?.replace('.svg', '.jsx'),
                    content: this.processFile(file),
                };
            });
            vueFiles.forEach(({ fileName, content }) => {
                writeFileSync(`${this.basePath}/${this.options.oD || 'components'}/${this.name}/${fileName}`, content, { encoding: 'utf-8' });
            });
        } else {
            console.log('This folder does not have any SVG file');
        }
    }

    private loadFiles(): string[] {
        this.iconsFolder = this.options.iF || 'icons';
        const rawFiles = readdirSync(Path.join(this.basePath, this.iconsFolder), { encoding: 'utf-8', withFileTypes: true, });
        const filteredFiles = rawFiles.filter(file => file.isFile() && file.name.endsWith('.svg') && file);
        return filteredFiles.map(file => this.basePath + '/' + this.iconsFolder + '/' + file.name);
    }

    private processFile(filePath: string): string {

        let reactTemplate = `${template}`;
        const props: PropsType = {};
        const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
        const htmlObject = new JSDOM('<html><head></head><body></body></html>');

        htmlObject.window.document.body.innerHTML = fileContent;

        const svgObject = htmlObject.window.document.body.firstChild as HTMLElement;

        this.processElement(svgObject, props);
        this.processChildNodes(props, svgObject.children);

        const componentName = filePath.split('/').pop()!
            .replace('.svg', '')
            .replace(' ', '_');

        reactTemplate = reactTemplate.replace(`%{${REACT_STATIC_TAGS.ICON_NAME}}`, componentName);
        reactTemplate = reactTemplate.replace(`%{${REACT_STATIC_TAGS.PROPS_DEFAULT}}`, JSON.stringify(props));
        let reactComponent = svgObject.outerHTML;

        reactComponent = reactComponent.replace(/[a-zA-Z-_]+=".+"/g, (substr) => {
            const attrs = substr.split(' ');

            const output: string[] = [];
            attrs.forEach(attr => {
                const attrName = attr.split('=')[0];
                if (!this.config?.attributesBlackList.includes(attrName) && attr.includes('=')) {
                    output.push(attr.replace('"', '{').replace('"', '}'));
                } else {
                    output.push(attr);
                }
            });
            return output.join(' ');
        });
        reactTemplate = reactTemplate.replace(`%{${REACT_STATIC_TAGS.JSX_TEMPLATE}}`, reactComponent);

        return reactTemplate;
    }
    private processChildNodes(props: PropsType, children?: HTMLCollection): void {
        if (children) {
            for (let i = 0; i < children.length; i += 1) {
                const child = children.item(i);
                if (child) {
                    this.processElement(child as HTMLElement, props);
                }
            }
        }
    }
    private processElement(element: HTMLElement, _props: PropsType): void {
        Object.values(element.attributes).forEach(attribute => {
            if (!this.config?.attributesBlackList.includes(attribute.name)) {
                const attrName = attribute.name;
                const defaultValue = attribute.value;
                this.fillProps(_props, attrName, defaultValue, element);
            }
        }, this);
    }

    private fillProps(_props: PropsType, attrName: string, defaultValue: string, element: HTMLElement): void {
        const props = _props;
        if (attrName === 'fill' || attrName === 'stroke') {
            if (!props[attrName]) {
                props[attrName] = [defaultValue]
            }
            if (!props[attrName].includes(defaultValue)) {
                props[attrName].push(defaultValue);
            }
            element.setAttribute(attrName, `props.${attrName}[${props[attrName].indexOf(defaultValue)}]`);
        } else {
            props[attrName] = defaultValue;
            element.setAttribute(attrName, `props.${attrName}`);
        }
    }

}