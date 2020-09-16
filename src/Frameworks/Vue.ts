import { CliOptions } from "../../cli";
import { Config } from "../../types";
import { Framework, VUE_STATIC_TAGS } from "./types";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import Path from 'path';
import { JSDOM } from 'jsdom';
import template from './Templates/vueTemplate.html';

interface PropsType {
    [key:string]:{ type: string, default:string }
}

export default class Vue implements Framework {
    private config?: Config;
    private iconsFolder? : string;
    name: string;

    constructor(private basePath:string ,private options: CliOptions){
        this.name = 'Vue';
    }

    run(config: Config){
        this.config = config;
        const files = this.loadFiles();
        if(files.length > 0){
            mkdirSync(`${this.basePath}/${this.options.oD||'components'}/${this.name}`, { recursive: true});
            const vueFiles = files.map(file=>{
                 return {
                     fileName: file.split('/').pop()?.replace('.svg','.vue'),
                     content: this.processFile(file),
                 };
            });
            vueFiles.forEach(({fileName,content})=>{
                writeFileSync(`${this.basePath}/${this.options.oD || 'components'}/${this.name}/${fileName}`,content ,{ encoding:'utf-8' });
            });
        } else {
            console.log('This folder does not have any SVG file');
        }
        
    }

    private loadFiles(): string[]{
        this.iconsFolder = this.options.iF || 'icons';
        const rawFiles = readdirSync(Path.join(this.basePath,this.iconsFolder),{ encoding:'utf-8', withFileTypes: true, });
        const filteredFiles = rawFiles.filter(file=>file.isFile() && file.name.endsWith('.svg') && file);
        return filteredFiles.map(file=>this.basePath+'/'+this.iconsFolder+'/'+file.name);
    }

    private processFile(filePath : string):string {

        let vueTemplate = `${template}`;
        let props: PropsType = {};
        const fileContent = readFileSync(filePath, { encoding:'utf-8' });
        const htmlObject = new JSDOM('<html><head></head><body></body></html>');
        
        htmlObject.window.document.body.innerHTML = fileContent;
        
        const svgObject = htmlObject.window.document.body.firstChild as HTMLElement;

        this.processElement(svgObject, props);
        this.processChildNodes(props,svgObject.children);

        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.TEMPLATE_HTML}}}`,svgObject.outerHTML);
        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.COMPONENT_NAME}}}`,filePath.split('/').pop()!.replace('.svg','').replace(' ','_'));
        vueTemplate = vueTemplate?.replace(`{{${VUE_STATIC_TAGS.PROPS_CONTENT}}}`, JSON.stringify( props, null, 2));
        
        return vueTemplate;
    }

    private processChildNodes(props: PropsType, children?: HTMLCollection){
        if(children){
            for(let i=0; i< children.length; i+=1){
                const child = children.item(i);
                if(child){
                    this.processElement(child as HTMLElement, props);
                }
            }
        }
    }
    private processElement(element: HTMLElement, props: PropsType){
        Object.values(element.attributes).forEach(attribute=>{ 
            if(!this.config?.attributesBlackList.includes(attribute.name)){
                const attrName = attribute.name;
                const defaultValue = attribute.value;
                element.removeAttribute(attrName);
                element.setAttribute(':'+attrName,attrName);
                props[attrName] = {
                    type:'string',
                    default: defaultValue,
                };
            }
        },this);
    }

}