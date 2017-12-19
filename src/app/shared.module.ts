import { NgModule } from '@angular/core';
import { AbTestsModule } from './modules/angular-ab-tests/module';

@NgModule({
  imports: [ AbTestsModule ],
  exports: [ AbTestsModule ],
})
export class SharedModule {}
