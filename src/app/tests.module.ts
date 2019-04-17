import { NgModule } from '@angular/core';
import { AbTestsModule, AbTestOptions } from './modules/angular-ab-tests/module';
import { AbTestsService } from './modules/angular-ab-tests/service';

export const abTestsOptions: AbTestOptions[] = [
  {
    versions: [ 'old', 'new' ],
    versionForCrawlers: 'old',
    weights: { new: 60 }
  },
];

@NgModule({
  imports: [
    AbTestsModule.forRoot(abTestsOptions),
  ],
})
export class TestsModule {
  constructor(private _abTestsService: AbTestsService) {
    this._abTestsService.setVersion('old');
  }
}
