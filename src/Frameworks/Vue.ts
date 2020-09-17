import { CliOptions } from "../../cli";
import { Config } from "../../types";
import { Framework, VUE_STATIC_TAGS } from "./types";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import Path from 'path';
import { JSDOM } from 'jsdom';
import template from './Templates/vueTemplate.html';

interface PropsType {
    [key: string]: { type: any, default: any, }
}

export default class Vue implements Framework {
    private config?: Config;
    private iconsFolder?: string;
    name: string;

    constructor(private basePath: string, private options: CliOptions) {
        this.name = 'Vue';
    }

    run(config: Config): void {
        this.config = config;
        const files = this.loadFiles();
        if (files.length > 0) {
            mkdirSync(`${this.basePath}/${this.options.oD || 'components'}/${this.name}`, { recursive: true });
            const vueFiles = files.map(file => {
                return {
                    fileName: file.split('/').pop()?.replace('.svg', '.vue'),
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

        let vueTemplate = `${template}`;
        const props: PropsType = {};
        const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
        const htmlObject = new JSDOM('<html><head></head><body></body></html>');

        htmlObject.window.document.body.innerHTML = fileContent;

        const svgObject = htmlObject.window.document.body.firstChild as HTMLElement;

        this.processElement(svgObject, props);
        this.processChildNodes(props, svgObject.children);

        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.TEMPLATE_HTML}}}`, svgObject.outerHTML);
        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.COMPONENT_NAME}}}`, (filePath.split('/').pop() || "").replace('.svg', '').replace(' ', '_'));
        const propsJson = JSON.stringify(props, null, 2)
            .replace(/('|")String('|")/g, 'String')
            .replace(/('|")Array('|")/g, 'Array');
        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.PROPS_CONTENT}}}`, propsJson);

        return vueTemplate;
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
                element.removeAttribute(attrName);
                this.fillProps(_props, attrName, defaultValue, element);
            }
        }, this);
    }

    private fillProps(_props: PropsType, attrName: string, defaultValue: string, element: HTMLElement): void {
        const props = _props;
        if (attrName === 'fill' || attrName === 'stroke') {
            if (!props[attrName]) {
                props[attrName] = {
                    type: 'Array',
                    default: [defaultValue],
                };
            }
            if (!props[attrName].default.includes(defaultValue)) {
                props[attrName].default.push(defaultValue);
            }
            element.setAttribute(':' + attrName, `${attrName}[${props[attrName].default.indexOf(defaultValue)}]`);
        } else {
            props[attrName] = {
                type: 'String',
                default: defaultValue,
            }
            element.setAttribute(':' + attrName, attrName);
        }
    }

}