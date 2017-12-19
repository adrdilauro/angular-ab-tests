import { NgModule } from '@angular/core';
import { AbTestsService } from './service';
import { CONFIG, COOKIE_HANDLER, CRAWLER_DETECTOR, RANDOM_EXTRACTOR } from './injection-tokens';
import { CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
import { AbTestVersionDirective } from './directive';
var AbTestsModule = (function () {
    function AbTestsModule() {
    }
    AbTestsModule.forRoot = function (configs) {
        return {
            ngModule: AbTestsModule,
            providers: [
                AbTestsService,
                { provide: CONFIG, useValue: configs },
                { provide: COOKIE_HANDLER, useClass: CookieHandler },
                { provide: CRAWLER_DETECTOR, useClass: CrawlerDetector },
                { provide: RANDOM_EXTRACTOR, useClass: RandomExtractor },
            ],
        };
    };
    AbTestsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AbTestVersionDirective
                    ],
                    exports: [
                        AbTestVersionDirective
                    ],
                },] },
    ];
    /** @nocollapse */
    AbTestsModule.ctorParameters = function () { return []; };
    return AbTestsModule;
}());
export { AbTestsModule };
//# sourceMappingURL=module.js.map