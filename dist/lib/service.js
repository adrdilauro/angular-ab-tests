import { Injectable, Inject } from '@angular/core';
import { AbTestForRealUser, AbTestForCrawler, CookieHandler, CrawlerDetector, RandomExtractor } from './classes';
import { CONFIG, AB_TESTS_COOKIE_HANDLER_TOKEN, AB_TESTS_CRAWLER_DETECTOR_TOKEN, AB_TESTS_RANDOM_EXTRACTOR_TOKEN } from './injection-tokens';
import { error } from './error';
export var COOKIE_NAMESPACE = 'angular-ab-tests';
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
        { type: Injectable },
    ];
    /** @nocollapse */
    AbTestsService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Inject, args: [CONFIG,] },] },
        { type: CookieHandler, decorators: [{ type: Inject, args: [AB_TESTS_COOKIE_HANDLER_TOKEN,] },] },
        { type: CrawlerDetector, decorators: [{ type: Inject, args: [AB_TESTS_CRAWLER_DETECTOR_TOKEN,] },] },
        { type: RandomExtractor, decorators: [{ type: Inject, args: [AB_TESTS_RANDOM_EXTRACTOR_TOKEN,] },] },
    ]; };
    return AbTestsService;
}());
export { AbTestsService };
//# sourceMappingURL=service.js.map