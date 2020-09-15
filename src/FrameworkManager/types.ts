export type FrameworkType = 'vue'| 'react';

export interface FMConfig {
    ignoredFiled?: string[];
    supportedFrameworks: FrameworkType[];
}