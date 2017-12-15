import { Component, Input, OnChanges, DoCheck } from '@angular/core';

@Component({
  selector: 'new-component',
  template: `
    <div style="width:500px;height:100px;background-color:green;margin-bottom:50px">
      <h1>This is the new component</h1>

      <h2>{{message}}</h2>
    </div>
  `
})
export class NewComponent implements OnChanges, DoCheck {
  public message: string;

  @Input()
  set value(x: string) {
    this.message = 'Value passed along is <<' + x + '>>';
  }

  ngOnChanges() {
    console.log('Triggered onChanges for NewComponent');
  }

  ngDoCheck() {
    console.log('Triggered doCheck for NewComponent');
  }
}
