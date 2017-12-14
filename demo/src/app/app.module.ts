import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, SharedModule, CoreModule ],
  providers: [],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
