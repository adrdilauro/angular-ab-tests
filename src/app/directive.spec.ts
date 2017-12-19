import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AbTestsModule } from './modules/angular-ab-tests/module';
import { AbTestVersionDirective } from './modules/angular-ab-tests/directive';
import {
  AB_TESTS_COOKIE_HANDLER_TOKEN,
  AB_TESTS_CRAWLER_DETECTOR_TOKEN,
  AB_TESTS_RANDOM_EXTRACTOR_TOKEN
} from './modules/angular-ab-tests/injection-tokens';

@Component({
  template: `
    <div *abTestVersion="'v1,v2';scope:'versions';forCrawlers:true" class="versions-v1-v2"></div>
    <div *abTestVersion="'v2';scope:'versions'" class="versions-v2"></div>
    <div *abTestVersion="'v3';scope:'versions'" class="versions-v3"></div>
    <div *abTestVersion="'blue';scope:'colors';forCrawlers:true" class="colors-blue"></div>
    <div *abTestVersion="'blue,green';scope:'colors'" class="colors-blue-green"></div>
    <div *abTestVersion="'red';scope:'colors'" class="colors-red"></div>
    <div *abTestVersion="'old'" class="default-old"></div>
    <div *abTestVersion="'new';forCrawlers:true" class="default-new"></div>
  `,
})
class TestAbTestVersionsComponent {}

let setUpSpies = function(versionsCookie, colorsCookie, defaultCookie, isCrawler?) {
  let randomized = [ 'v1', 'red', 'old' ];
  let randomizedIndex = 0;
  return {
    cookieHandler: {
      get: spyOn(TestBed.get(AB_TESTS_COOKIE_HANDLER_TOKEN), 'get').and.callFake(function(cookieName) {
        switch(cookieName) {
        case 'angular-ab-tests-versions':
          return versionsCookie;
        case 'angular-ab-tests-colors':
          return colorsCookie;
        case 'angular-ab-tests-default':
          return defaultCookie;
        }
      }),
      set: spyOn(TestBed.get(AB_TESTS_COOKIE_HANDLER_TOKEN), 'set'),
    },
    randomExtractor: {
      setWeights: spyOn(TestBed.get(AB_TESTS_RANDOM_EXTRACTOR_TOKEN), 'setWeights'),
      setVersions: spyOn(TestBed.get(AB_TESTS_RANDOM_EXTRACTOR_TOKEN), 'setVersions').and.callFake(function(versions) {
        randomizedIndex = randomized.indexOf(versions[0]);
      }),
      run: spyOn(TestBed.get(AB_TESTS_RANDOM_EXTRACTOR_TOKEN), 'run').and.callFake(function(cookieName) {
        return randomized[randomizedIndex];
      }),
    },
    crawlerDetector: {
      isCrawler: spyOn(TestBed.get(AB_TESTS_CRAWLER_DETECTOR_TOKEN), 'isCrawler').and.returnValue(!!isCrawler),
    },
  };
}

let testCall = {
  randomExtractor: {
    versions: function(arg) {
      expect(arg.length).toBe(3);
      expect(arg[0][0]).toBe(45);
      expect(arg[0][1]).toBe('v1');
      expect(arg[1][0]).toBe(78.333);
      expect(arg[1][1]).toBe('v3');
      expect(arg[2][0]).toBe(100);
      expect(arg[2][1]).toBe('v2');
    },
    colors: function(arg) {
      expect(arg.length).toBe(0);
    },
    default: function(arg) {
      expect(arg.length).toBe(2);
      expect(arg[0][0]).toBe(60);
      expect(arg[0][1]).toBe('old');
      expect(arg[1][0]).toBe(100);
      expect(arg[1][1]).toBe('new');
    },
  },
  cookieHandler: {
    versions: function(arg) {
      expect(arg.length).toBe(4);
      expect(arg[0]).toBe('angular-ab-tests-versions');
      expect(arg[1]).toBe('v1');
      expect(arg[2]).toBe(undefined);
      expect(arg[3]).toBe(45);
    },
    colors: function(arg) {
      expect(arg.length).toBe(4);
      expect(arg[0]).toBe('angular-ab-tests-colors');
      expect(arg[1]).toBe('red');
      expect(arg[2]).toBe(undefined);
      expect(arg[3]).toBe(undefined);
    },
    default: function(arg) {
      expect(arg.length).toBe(4);
      expect(arg[0]).toBe('angular-ab-tests-default');
      expect(arg[1]).toBe('old');
      expect(arg[2]).toBe('xxx.xxx');
      expect(arg[3]).toBe(undefined);
    },
  }
};

let testCallsSetWeights = function(calls, toExpect) {
  expect(calls.length).toBe(toExpect.length);
  for (var i = 0; i < toExpect.length; i++) {
    testCall.randomExtractor[toExpect[i]](calls[i].args[0]);
  }
}

let testCallsSetCookie = function(calls, toExpect) {
  expect(calls.length).toBe(toExpect.length);
  for (var i = 0; i < toExpect.length; i++) {
    testCall.cookieHandler[toExpect[i]](calls[i].args);
  }
}

describe('Directive: AbTestVersion', () => {
  let fixture: ComponentFixture<TestAbTestVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AbTestsModule.forRoot(
          [
            {
              versions: [ 'v1', 'v2', 'v3' ],
              scope: 'versions',
              expiration: 45,
              weights: { v1: 45, v3: 100/3 }
            },
            {
              versions: [ 'red', 'green', 'blue' ],
              scope: 'colors',
              versionForCrawlers: 'green',
            },
            {
              versions: [ 'old', 'new' ],
              domain: 'xxx.xxx',
              versionForCrawlers: 'old',
              weights: { old: 60 }
            },
          ]
        ),
      ],
      declarations: [ TestAbTestVersionsComponent ],
    });
  });

  it('null null old', () => {
    let spies = setUpSpies(null, null, 'old');
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(false);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), ['versions', 'colors']);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), ['versions', 'colors']);
    expect(spies.randomExtractor.run.calls.all().length).toBe(2);
  });

  it('null null null', () => {
    let spies = setUpSpies(null, null, null);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(false);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), ['versions', 'colors', 'default']);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), ['versions', 'colors', 'default']);
    expect(spies.randomExtractor.run.calls.all().length).toBe(3);
  });

  it('v1 null new', () => {
    let spies = setUpSpies('v1', null, 'new');
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), ['colors']);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), ['colors']);
    expect(spies.randomExtractor.run.calls.all().length).toBe(1);
  });

  it('v2 null null', () => {
    let spies = setUpSpies('v2', null, null);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(false);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), ['colors', 'default']);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), ['colors', 'default']);
    expect(spies.randomExtractor.run.calls.all().length).toBe(2);
  });

  it('v3 blue new', () => {
    let spies = setUpSpies('v3', 'blue', 'new');
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v3 green null', () => {
    let spies = setUpSpies('v3', 'green', null);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(false);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), ['default']);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), ['default']);
    expect(spies.randomExtractor.run.calls.all().length).toBe(1);
  });

  it('v2 blue new', () => {
    let spies = setUpSpies('v2', 'blue', 'new');
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('null null old crawler', () => {
    let spies = setUpSpies(null, null, 'old', true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('null null null crawler', () => {
    let spies = setUpSpies(null, null, null, true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v1 null new crawler', () => {
    let spies = setUpSpies('v1', null, 'new', true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v2 null null crawler', () => {
    let spies = setUpSpies('v2', null, null, true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v3 blue new crawler', () => {
    let spies = setUpSpies('v3', 'blue', 'new', true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v3 green null crawler', () => {
    let spies = setUpSpies('v3', 'green', null, true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });

  it('v2 blue new crawler', () => {
    let spies = setUpSpies('v2', 'blue', 'new', true);
    fixture = TestBed.createComponent(TestAbTestVersionsComponent);
    fixture.detectChanges();
    expect(!!fixture.debugElement.query(By.css('.versions-v1-v2'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.versions-v2'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.versions-v3'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.colors-blue'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-blue-green'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.colors-red'))).toBe(false);
    expect(!!fixture.debugElement.query(By.css('.default-old'))).toBe(true);
    expect(!!fixture.debugElement.query(By.css('.default-new'))).toBe(true);
    testCallsSetCookie(spies.cookieHandler.set.calls.all(), []);
    testCallsSetWeights(spies.randomExtractor.setWeights.calls.all(), []);
    expect(spies.randomExtractor.run.calls.all().length).toBe(0);
  });
});
