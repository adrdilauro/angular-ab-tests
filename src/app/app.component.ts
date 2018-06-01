import { Component, OnInit } from '@angular/core';
import { AbTestsService } from './modules/angular-ab-tests/service';

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
export class AppComponent implements OnInit {
  public values = ['John Lennon', 'Ringo Starr', 'Paul McCartney', 'George Harrison'];
  public randomizedIndex: number = this.getRandomIndex();

  constructor(private abTestsService: AbTestsService) {}

  randomizeValue() {
    this.randomizedIndex = this.getRandomIndex();
  }

  ngOnInit() {
    console.log(this.abTestsService.getVersion());
  }

  private getRandomIndex() {
    return Math.floor(Math.random() * 100) % 4;
  }
}
