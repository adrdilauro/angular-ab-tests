import { error } from './error';
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
export { AbTestForRealUser };
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
export { AbTestForCrawler };
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
export { RandomExtractor };
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
export { CrawlerDetector };
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
export { CookieHandler };
//# sourceMappingURL=classes.js.map