import { ModuleWithProviders } from '@angular/core';
export interface AbTestOptions {
    versions: string[];
    domain?: string;
    versionForCrawlers?: string;
    scope?: string;
    expiration?: number;
    weights?: {
        [x: string]: number;
    };
}
export declare class AbTestsModule {
    static forRoot(configs: AbTestOptions[]): ModuleWithProviders;
}
