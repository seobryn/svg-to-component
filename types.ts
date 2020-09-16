
export type FrameworkType = 'Vue' | 'React';

export interface Config {
    ignoredFiles: string[],
    supportedFrameworks : FrameworkType[],
    attributesBlackList: string[],
}