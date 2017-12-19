import { Component, Input, OnChanges, DoCheck } from '@angular/core';

@Component({
  selector: 'old-component',
  template: `
    <div style="width:500px;height:100px;background-color:red;margin-bottom:50px">
      <h1>This is the old component</h1>

      <h2>{{message}}</h2>
    </div>
  `
})
export class OldComponent implements OnChanges, DoCheck {
  public message: string;

  @Input()
  set value(x: string) {
    this.message = 'Value passed along is <<' + x + '>>';
  }

  ngOnChanges() {
    console.log('Triggered onChanges for OldComponent');
  }

  ngDoCheck() {
    console.log('Triggered doCheck for OldComponent');
  }
}
