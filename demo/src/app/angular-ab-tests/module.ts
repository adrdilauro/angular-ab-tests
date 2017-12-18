import { NgModule, ModuleWithProviders } from '@angular/core';
import { AbTestsService } from './service';
import { CONFIG, COOKIE_HANDLER, CRAWLER_DETECTOR, RANDOM_EXTRACTOR } from './injection-tokens';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
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

@NgModule({
  declarations: [
    AbTestVersionDirective
  ],
  exports: [
    AbTestVersionDirective
  ],
})
export class AbTestsModule {
  static forRoot(configs: AbTestOptions[]): ModuleWithProviders {
    return {
      ngModule: AbTestsModule,
      providers: [
        AbTestsService,
        { provide: CONFIG, useValue: configs },
        { provide: COOKIE_HANDLER, useClass: CookieHandler },
        { provide: CRAWLER_DETECTOR, useClass: CrawlerDetector },
        { provide: RANDOM_EXTRACTOR, useClass: RandomExtractor },
      ],
    }
  }
}