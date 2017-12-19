import { NgModule } from '@angular/core';
import { AbTestsModule } from 'angular-ab-tests';

@NgModule({
  imports: [ AbTestsModule ],
  exports: [ AbTestsModule ],
})
export class SharedModule {}
