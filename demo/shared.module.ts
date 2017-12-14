import { NgModule } from '@angular/core';
import { AbTestsModule } from './angular-ab-tests/angular-ab-tests.module';

@NgModule({
  imports: [ AbTestsModule ],
  exports: [ AbTestsModule ],
})
export class SharedModule {}
