import { error } from './error';

export class AbTestForRealUser {
  private _versions: string[] = [];
  private _chosenVersion: string;

  constructor(versions: string[], chosenVersion: string) {
    this._versions = versions;
    this._chosenVersion = chosenVersion;
  }

  getVersion(): string {
    return this._chosenVersion;
  }

  setVersion(version: string) {
    if (this._versions.indexOf(version) === -1) {
      error('Version <' + version + '> has not been declared: [ ' + this._versions.join(', ') + ' ]');
    }
    this._chosenVersion = version;
  }

  shouldRender(versions: string[], forCrawlers: boolean): boolean {
    for (let version of versions) {
      if (this._versions.indexOf(version) === -1) {
        error('Version <' + version + '> has not been declared: [ ' + this._versions.join(', ') + ' ]');
      }
    }
    return (versions.indexOf(this._chosenVersion) !== -1);
  }
}

export class AbTestForCrawler {
  private _version: string;

  constructor(version?: string) {
    if (!!version) {
      this._version = version;
    }
  }

  getVersion(): string {
    return '';
  }

  setVersion(version: string) {}

  shouldRender(versions: string[], forCrawlers: boolean): boolean {
    return forCrawlers || (!!this._version && versions.indexOf(this._version) !== -1);
  }
}

export class RandomExtractor {
  private _weights: [number, string][];
  private _versions: string[];

  setWeights(weights: [number, string][]) {
    this._weights = weights;
  }

  setVersions(versions: string[]) {
    this._versions = versions;
  }

  run(): string {
    if (this._weights.length === 0) {
      return this._versions[Math.floor(Math.random() * this._versions.length)];
    }
    let random: number = Math.random() * 100;
    for (let weight of this._weights) {
      if (random <= weight[0]) {
        return weight[1];
      }
    }
    return this._versions[0];
  }
}

export class CrawlerDetector {
  private _regexps: RegExp[] = [
    /bot/i, /spider/i, /facebookexternalhit/i, /simplepie/i, /yahooseeker/i, /embedly/i,
    /quora link preview/i, /outbrain/i, /vkshare/i, /monit/i, /Pingability/i, /Monitoring/i,
    /WinHttpRequest/i, /Apache-HttpClient/i, /getprismatic.com/i, /python-requests/i, /Twurly/i,
    /yandex/i, /browserproxy/i, /Monitoring/i, /crawler/i, /Qwantify/i, /Yahoo! Slurp/i, /pinterest/i
  ];

  isCrawler() {
    return this._regexps.some(function (crawler) {
      return crawler.test(window.navigator.userAgent)
    });
  }
}

export class CookieHandler {
  public get(name: string): string {
    name = encodeURIComponent(name);
    let regexp: RegExp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    let results = regexp.exec(document.cookie);
    return (!results) ? '' : decodeURIComponent(results[1]);
  }

  public set(name: string, value: string, domain?: string, expires?: number) {
    let cookieStr = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    if (expires) {
      let dtExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
      cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
    }
    if (domain) {
      cookieStr += 'domain=' + domain + ';';
    }
    document.cookie = cookieStr;
  }
}
