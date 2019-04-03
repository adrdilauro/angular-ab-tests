import { InjectionToken } from '@angular/core';
import { AbTestOptions, AbTestSsrAbstraction } from './module';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';

export const CONFIG = new InjectionToken<AbTestOptions[]>('ANGULAR_AB_TEST_CONFIG');
export const AB_TESTS_COOKIE_HANDLER_TOKEN = new InjectionToken<CookieHandler>('ANGULAR_AB_TEST_COOKIE_HANDLER');
export const AB_TESTS_CRAWLER_DETECTOR_TOKEN = new InjectionToken<CrawlerDetector>('ANGULAR_AB_TEST_CRAWLER_DETECTOR');
export const AB_TESTS_RANDOM_EXTRACTOR_TOKEN = new InjectionToken<RandomExtractor>('ANGULAR_AB_TEST_RANDOM_EXTRACTOR');
export const AB_TESTS_SSR_ABSTRACTION = new InjectionToken<AbTestSsrAbstraction>('AB_TESTS_SSR_ABSTRACTION');
