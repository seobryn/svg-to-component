export type FrameworkType = 'Vue'| 'React';

export interface FMConfig {
    ignoredFiled?: string[];
    supportedFrameworks: FrameworkType[];
}