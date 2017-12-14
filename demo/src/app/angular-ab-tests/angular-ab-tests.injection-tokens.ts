import { InjectionToken } from '@angular/core';
import { AbTestOptions } from './angular-ab-tests.module';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './angular-ab-tests.classes';

export const CONFIG = new InjectionToken<AbTestOptions[]>('ANGULAR_AB_TEST_CONFIG');
export const COOKIE_HANDLER = new InjectionToken<CookieHandler>('ANGULAR_AB_TEST_COOKIE_HANDLER');
export const CRAWLER_DETECTOR = new InjectionToken<CrawlerDetector>('ANGULAR_AB_TEST_CRAWLER_DETECTOR');
export const RANDOM_EXTRACTOR = new InjectionToken<RandomExtractor>('ANGULAR_AB_TEST_RANDOM_EXTRACTOR');
