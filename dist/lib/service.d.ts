import { AbTestOptions } from './module';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
export declare const COOKIE_NAMESPACE = "angular-ab-tests";
export declare class AbTestsService {
    private _tests;
    private _cookieHandler;
    private _randomExtractor;
    private _defaultScope;
    constructor(configs: AbTestOptions[], cookieHandler: CookieHandler, crawlerDetector: CrawlerDetector, randomExtractor: RandomExtractor);
    shouldRender(versions: string[], scope: string, forCrawlers: boolean): boolean;
    private filterVersions(versions);
    private setupTestForCrawler(scope, versions, config);
    private setupTestForRealUser(scope, versions, config);
    private generateVersion(config);
    private processWeights(weights, versions);
    private roundFloat(x);
}
