import { NgModule } from '@angular/core';
import { AbTestsService } from './service';
import { CONFIG, AB_TESTS_COOKIE_HANDLER_TOKEN, AB_TESTS_CRAWLER_DETECTOR_TOKEN, AB_TESTS_RANDOM_EXTRACTOR_TOKEN } from './injection-tokens';
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
                { provide: AB_TESTS_COOKIE_HANDLER_TOKEN, useClass: CookieHandler },
                { provide: AB_TESTS_CRAWLER_DETECTOR_TOKEN, useClass: CrawlerDetector },
                { provide: AB_TESTS_RANDOM_EXTRACTOR_TOKEN, useClass: RandomExtractor },
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