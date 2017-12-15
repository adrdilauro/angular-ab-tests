import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *abTestVersion="'old'">
      <old-component [value]="values[randomizedIndex]">
      </old-component>
    </ng-container>

    <ng-container *abTestVersion="'new'">
      <new-component [value]="values[randomizedIndex]">
      </new-component>
    </ng-container>

    <a (click)="randomizeValue()" style="cursor:pointer;padding:20px;border:1px solid black">
      Click here to randomize!
    </a>
  `
})
export class AppComponent {
  public values = ['John Lennon', 'Ringo Starr', 'Paul McCartney', 'George Harrison'];
  public randomizedIndex: number = this.getRandomIndex();

  randomizeValue() {
    this.randomizedIndex = this.getRandomIndex();
  }

  private getRandomIndex() {
    return Math.floor(Math.random() * 100) % 4;
  }
}
