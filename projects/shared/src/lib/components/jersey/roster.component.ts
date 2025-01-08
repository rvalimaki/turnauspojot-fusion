import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-roster',
  template: `
    <ng-container *ngFor="let p of players">
      <app-jersey [player]="p" [ngClass]="color"></app-jersey>
    </ng-container>
  `,
  styleUrls: ['./roster.component.scss'],
})
export class RosterComponent {
  @Input() players: any[] = [];
  @Input() color: string = '';
}
