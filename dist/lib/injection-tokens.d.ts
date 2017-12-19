import { InjectionToken } from '@angular/core';
import { AbTestOptions } from './module';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
export declare const CONFIG: InjectionToken<AbTestOptions[]>;
export declare const AB_TESTS_COOKIE_HANDLER_TOKEN: InjectionToken<CookieHandler>;
export declare const AB_TESTS_CRAWLER_DETECTOR_TOKEN: InjectionToken<CrawlerDetector>;
export declare const AB_TESTS_RANDOM_EXTRACTOR_TOKEN: InjectionToken<RandomExtractor>;
