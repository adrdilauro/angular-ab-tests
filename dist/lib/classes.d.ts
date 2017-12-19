export declare class AbTestForRealUser {
    private _versions;
    private _chosenVersion;
    constructor(versions: string[], chosenVersion: string);
    shouldRender(versions: string[], forCrawlers: boolean): boolean;
}
export declare class AbTestForCrawler {
    private _version;
    constructor(version?: string);
    shouldRender(versions: string[], forCrawlers: boolean): boolean;
}
export declare class RandomExtractor {
    private _weights;
    private _versions;
    setWeights(weights: [number, string][]): void;
    setVersions(versions: string[]): void;
    run(): string;
}
export declare class CrawlerDetector {
    private _regexps;
    isCrawler(): boolean;
}
export declare class CookieHandler {
    get(name: string): string;
    set(name: string, value: string, domain?: string, expires?: number): void;
}
