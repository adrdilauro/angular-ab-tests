import { InjectionToken } from '@angular/core';
import { AbTestOptions } from './module';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
export declare const CONFIG: InjectionToken<AbTestOptions[]>;
export declare const COOKIE_HANDLER: InjectionToken<CookieHandler>;
export declare const CRAWLER_DETECTOR: InjectionToken<CrawlerDetector>;
export declare const RANDOM_EXTRACTOR: InjectionToken<RandomExtractor>;
