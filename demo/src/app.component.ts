import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div *abTestVersion="'old'">Old version!</div>
    <div *abTestVersion="'new'">New version!</div>
  `
})
export class AppComponent {}
