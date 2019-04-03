import { NgModule } from '@angular/core';
import { AbTestsModule, AbTestOptions, AbTestSsrAbstraction } from './modules/angular-ab-tests/module';

export const abTestsOptions: AbTestOptions[] = [
  {
    versions: [ 'old', 'new' ],
    versionForCrawlers: 'old',
    weights: { new: 60 }
  },
];

export class SsrEmulatorOfCookieAndUserAgent implements AbTestSsrAbstraction {
  getCookie(): string {
    // return <string>(document.cookie);
    return '';
  }

  setCookie(cookieString: string) {
    // document.cookie = cookieString;
  }

  getUserAgent(): string {
    // return <string>(window.navigator.userAgent);
    return '':
  }
}


@NgModule({
  imports: [
    AbTestsModule.forRoot(abTestsOptions, new SsrEmulatorOfCookieAndUserAgent()),
  ],
})
export class TestsModule {}
