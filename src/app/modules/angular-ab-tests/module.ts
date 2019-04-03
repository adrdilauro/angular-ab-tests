import { NgModule, ModuleWithProviders } from '@angular/core';
import { AbTestsService } from './service';
import {
  CONFIG, AB_TESTS_COOKIE_HANDLER_TOKEN, AB_TESTS_CRAWLER_DETECTOR_TOKEN,
  AB_TESTS_RANDOM_EXTRACTOR_TOKEN, AB_TESTS_SSR_ABSTRACTION
} from './injection-tokens';
import { BrowserCookieAndUserAgent, CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
import { AbTestVersionDirective } from './directive';

export interface AbTestOptions {
  versions: string[];
  domain?: string;
  versionForCrawlers?: string;
  scope?: string;
  expiration?: number;
  weights?: {
    [x: string]: number,
  };
}

export interface AbTestSsrAbstraction {
  getCookie(): string;
  setCookie(cookieString: string);
  getUserAgent(): string;
}

@NgModule({
  declarations: [
    AbTestVersionDirective
  ],
  exports: [
    AbTestVersionDirective
  ],
})
export class AbTestsModule {
  static forRoot(configs: AbTestOptions[], ssrAbstraction?: AbTestSsrAbstraction): ModuleWithProviders {
    return {
      ngModule: AbTestsModule,
      providers: [
        AbTestsService,
        { provide: CONFIG, useValue: configs },
        { provide: AB_TESTS_COOKIE_HANDLER_TOKEN, useClass: CookieHandler },
        { provide: AB_TESTS_CRAWLER_DETECTOR_TOKEN, useClass: CrawlerDetector },
        { provide: AB_TESTS_RANDOM_EXTRACTOR_TOKEN, useClass: RandomExtractor },
        { provide: AB_TESTS_SSR_ABSTRACTION, useValue: ssrAbstraction || new BrowserCookieAndUserAgent() },
      ],
    }
  }
}
