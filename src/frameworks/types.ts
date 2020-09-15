export interface Framework {
    transform: (files: string[])=> Promise<boolean>;
}