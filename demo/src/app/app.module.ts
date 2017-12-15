import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';
import { OldComponent } from './old.component';
import { NewComponent } from './new.component';

@NgModule({
  declarations: [ AppComponent, OldComponent, NewComponent ],
  imports: [ BrowserModule, SharedModule, CoreModule ],
  providers: [],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
