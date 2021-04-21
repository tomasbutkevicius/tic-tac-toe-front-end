import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button *ngIf="!value">{{ value }}</button>
    <button hero status="success" *ngIf="value == 'X'">{{ value }}</button>
    <button hero status="info" *ngIf="value == 'O'">{{ value }}</button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value: 'X' | 'O';
}
