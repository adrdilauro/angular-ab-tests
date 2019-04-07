import {NgModule} from '@angular/core';
import {CookieHandler, CrawlerDetector} from '../classes';
import {ServerCrawlerDetectorService} from './server-crawler-detector.service';
import {ServerCookieHandlerService} from './server-cookie-handler.service';

@NgModule({
  providers: [
    {
      provide: CrawlerDetector,
      useClass: ServerCrawlerDetectorService
    },
    {
      provide: CookieHandler,
      useClass: ServerCookieHandlerService
    },
  ]
})
export class AbTestsServerModule {

}
