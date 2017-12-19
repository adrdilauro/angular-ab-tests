(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.angularabtests = global.ng.angularabtests || {}),global.ng.core));
}(this, (function (exports,_angular_core) { 'use strict';

function error(msg) {
    throw ('AngularAbTests error: ' + msg);
}

var AbTestForRealUser = (function () {
    function AbTestForRealUser(versions, chosenVersion) {
        this._versions = [];
        this._versions = versions;
        this._chosenVersion = chosenVersion;
    }
    AbTestForRealUser.prototype.shouldRender = function (versions, forCrawlers) {
        for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
            var version = versions_1[_i];
            if (this._versions.indexOf(version) === -1) {
                error('Version <' + version + '> has not been declared: [ ' + this._versions.join(', ') + ' ]');
            }
        }
        return (versions.indexOf(this._chosenVersion) !== -1);
    };
    return AbTestForRealUser;
}());
var AbTestForCrawler = (function () {
    function AbTestForCrawler(version) {
        if (!!version) {
            this._version = version;
        }
    }
    AbTestForCrawler.prototype.shouldRender = function (versions, forCrawlers) {
        return forCrawlers || (!!this._version && versions.indexOf(this._version) !== -1);
    };
    return AbTestForCrawler;
}());
var RandomExtractor = (function () {
    function RandomExtractor() {
    }
    RandomExtractor.prototype.setWeights = function (weights) {
        this._weights = weights;
    };
    RandomExtractor.prototype.setVersions = function (versions) {
        this._versions = versions;
    };
    RandomExtractor.prototype.run = function () {
        if (this._weights.length === 0) {
            return this._versions[Math.floor(Math.random() * this._versions.length)];
        }
        var random = Math.random() * 100;
        for (var _i = 0, _a = this._weights; _i < _a.length; _i++) {
            var weight = _a[_i];
            if (random <= weight[0]) {
                return weight[1];
            }
        }
        return this._versions[0];
    };
    return RandomExtractor;
}());
var CrawlerDetector = (function () {
    function CrawlerDetector() {
        this._regexps = [
            /bot/i, /spider/i, /facebookexternalhit/i, /simplepie/i, /yahooseeker/i, /embedly/i,
            /quora link preview/i, /outbrain/i, /vkshare/i, /monit/i, /Pingability/i, /Monitoring/i,
            /WinHttpRequest/i, /Apache-HttpClient/i, /getprismatic.com/i, /python-requests/i, /Twurly/i,
            /yandex/i, /browserproxy/i, /Monitoring/i, /crawler/i, /Qwantify/i, /Yahoo! Slurp/i, /pinterest/i
        ];
    }
    CrawlerDetector.prototype.isCrawler = function () {
        return this._regexps.some(function (crawler) {
            return crawler.test(window.navigator.userAgent);
        });
    };
    return CrawlerDetector;
}());
var CookieHandler = (function () {
    function CookieHandler() {
    }
    CookieHandler.prototype.get = function (name) {
        name = encodeURIComponent(name);
        var regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
        var results = regexp.exec(document.cookie);
        return (!results) ? '' : decodeURIComponent(results[1]);
    };
    CookieHandler.prototype.set = function (name, value, domain, expires) {
        var cookieStr = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
        if (expires) {
            var dtExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
            cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
        }
        if (domain) {
            cookieStr += 'domain=' + domain + ';';
        }
        document.cookie = cookieStr;
    };
    return CookieHandler;
}());

var CONFIG = new _angular_core.InjectionToken('ANGULAR_AB_TEST_CONFIG');
var COOKIE_HANDLER = new _angular_core.InjectionToken('ANGULAR_AB_TEST_COOKIE_HANDLER');
var CRAWLER_DETECTOR = new _angular_core.InjectionToken('ANGULAR_AB_TEST_CRAWLER_DETECTOR');
var RANDOM_EXTRACTOR = new _angular_core.InjectionToken('ANGULAR_AB_TEST_RANDOM_EXTRACTOR');

var COOKIE_NAMESPACE = 'angular-ab-tests';
var AbTestsService = (function () {
    function AbTestsService(configs, cookieHandler, crawlerDetector, randomExtractor) {
        this._tests = {};
        this._defaultScope = 'default';
        this._cookieHandler = cookieHandler;
        this._randomExtractor = randomExtractor;
        var isCrawler = crawlerDetector.isCrawler();
        for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
            var config = configs_1[_i];
            var scope = this._defaultScope;
            if (!!config.scope) {
                scope = config.scope;
            }
            if (!!this._tests[scope]) {
                error('Test with scope <' + scope + '> cannot be initialized twice');
            }
            if (isCrawler) {
                this.setupTestForCrawler(scope, this.filterVersions(config.versions), config);
            }
            else {
                this.setupTestForRealUser(scope, this.filterVersions(config.versions), config);
            }
        }
    }
    AbTestsService.prototype.shouldRender = function (versions, scope, forCrawlers) {
        var scopeOrDefault = scope || this._defaultScope;
        if (!this._tests[scopeOrDefault]) {
            error('Test with scope <' + scopeOrDefault + '> has not been defined');
        }
        return this._tests[scopeOrDefault].shouldRender(versions, forCrawlers);
    };
    AbTestsService.prototype.filterVersions = function (versions) {
        var resp = [];
        if (versions.length < 2) {
            error('You have to provide at least two versions');
        }
        for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
            var version = versions_1[_i];
            if (resp.indexOf(version) !== -1) {
                error('Version <' + version + '> is repeated in the array of versions [ ' + versions.join(', ') + ' ]');
            }
            resp.push(version);
        }
        return resp;
    };
    AbTestsService.prototype.setupTestForCrawler = function (scope, versions, config) {
        if (!!config.versionForCrawlers && versions.indexOf(config.versionForCrawlers) === -1) {
            error('Version for crawlers <' + config.versionForCrawlers + '> is not included in versions [ ' + versions.join(', ') + ' ]');
        }
        this._tests[scope] = new AbTestForCrawler(config.versionForCrawlers);
    };
    AbTestsService.prototype.setupTestForRealUser = function (scope, versions, config) {
        var chosenVersion = this.generateVersion({
            versions: versions,
            cookieName: COOKIE_NAMESPACE + '-' + scope,
            domain: config.domain,
            expiration: config.expiration,
            weights: config.weights,
        });
        this._tests[scope] = new AbTestForRealUser(versions, chosenVersion);
    };
    AbTestsService.prototype.generateVersion = function (config) {
        var chosenVersion = this._cookieHandler.get(config.cookieName);
        if (config.versions.indexOf(chosenVersion) !== -1) {
            return chosenVersion;
        }
        this._randomExtractor.setWeights(this.processWeights(config.weights || {}, config.versions));
        this._randomExtractor.setVersions(config.versions);
        chosenVersion = this._randomExtractor.run();
        this._cookieHandler.set(config.cookieName, chosenVersion, config.domain, config.expiration);
        return chosenVersion;
    };
    AbTestsService.prototype.processWeights = function (weights, versions) {
        var processedWeights = [];
        var totalWeight = 0;
        var tempVersions = versions.slice(0);
        var index = -100;
        for (var key in weights) {
            index = tempVersions.indexOf(key);
            if (index === -1) {
                error('Weight associated to <' + key + '> which is not included in versions [ ' + versions.join(', ') + ' ]');
            }
            tempVersions.splice(index, 1);
            totalWeight += this.roundFloat(weights[key]);
            processedWeights.push([totalWeight, key]);
        }
        if (index === -100) {
            return [];
        }
        if (totalWeight >= 100) {
            error('Sum of weights is <' + totalWeight + '>, while it should be less than 100');
        }
        var remainingWeight = this.roundFloat((100 - totalWeight) / tempVersions.length);
        for (var _i = 0, tempVersions_1 = tempVersions; _i < tempVersions_1.length; _i++) {
            var version = tempVersions_1[_i];
            totalWeight += remainingWeight;
            processedWeights.push([totalWeight, version]);
        }
        processedWeights[processedWeights.length - 1] = [100, processedWeights[processedWeights.length - 1][1]];
        return processedWeights;
    };
    AbTestsService.prototype.roundFloat = function (x) {
        return Math.round(x * 1000) / 1000;
    };
    AbTestsService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    AbTestsService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: _angular_core.Inject, args: [CONFIG,] },] },
        { type: CookieHandler, decorators: [{ type: _angular_core.Inject, args: [COOKIE_HANDLER,] },] },
        { type: CrawlerDetector, decorators: [{ type: _angular_core.Inject, args: [CRAWLER_DETECTOR,] },] },
        { type: RandomExtractor, decorators: [{ type: _angular_core.Inject, args: [RANDOM_EXTRACTOR,] },] },
    ]; };
    return AbTestsService;
}());

var AbTestVersionDirective = (function () {
    function AbTestVersionDirective(_service, _viewContainer, _templateRef) {
        this._service = _service;
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
        this._forCrawlers = false;
    }
    AbTestVersionDirective.prototype.ngOnInit = function () {
        if (this._service.shouldRender(this._versions, this._scope, this._forCrawlers)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    };
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersion", {
        set: function (value) {
            this._versions = value.split(',');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersionScope", {
        set: function (value) {
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersionForCrawlers", {
        set: function (value) {
            this._forCrawlers = value;
        },
        enumerable: true,
        configurable: true
    });
    AbTestVersionDirective.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[abTestVersion]'
                },] },
    ];
    /** @nocollapse */
    AbTestVersionDirective.ctorParameters = function () { return [
        { type: AbTestsService, },
        { type: _angular_core.ViewContainerRef, },
        { type: _angular_core.TemplateRef, },
    ]; };
    AbTestVersionDirective.propDecorators = {
        "abTestVersion": [{ type: _angular_core.Input },],
        "abTestVersionScope": [{ type: _angular_core.Input },],
        "abTestVersionForCrawlers": [{ type: _angular_core.Input },],
    };
    return AbTestVersionDirective;
}());

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
        { type: _angular_core.NgModule, args: [{
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

exports.AbTestsModule = AbTestsModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
