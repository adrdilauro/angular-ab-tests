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
  getCookie(): string { // WRITE YOUR OWN IMPLEMENTATION OF THIS
    // return <string>(document.cookie);
    return '';
  }

  setCookie(cookieString: string) { // WRITE YOUR OWN IMPLEMENTATION OF THIS
    // document.cookie = cookieString;
  }

  getUserAgent(): string { // WRITE YOUR OWN IMPLEMENTATION OF THIS
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
