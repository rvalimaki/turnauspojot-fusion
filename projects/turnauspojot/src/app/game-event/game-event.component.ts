import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-event',
  template: `
    <ng-template [ngIf]="event.eventType === 'goal'">
      <strong><span class="full">#{{getNumber(event.player)}} </span>{{getPlayerName(event.player)}} {{event.score}}
      </strong><br>
      <ng-template [ngIf]="event.assist1 != null"><span class="full">#{{getNumber(event.assist1)}} </span>
        {{getPlayerName(event.assist1)}}</ng-template>
      <ng-template [ngIf]="event.assist2 != null">, <span class="full">#{{getNumber(event.assist2)}} </span>
        {{getPlayerName(event.assist2)}}
      </ng-template>
    </ng-template>

    <ng-template [ngIf]="event.eventType === 'penalty'">
        <span
          class="full">#{{getNumber(event.player)}} </span>{{getPlayerName(event.player)}} {{event.readable}} {{event.reason}}
    </ng-template>
  `,
  styleUrls: ['./game-event.component.scss']
})
export class GameEventComponent implements OnInit {
  @Input() event: any = null;
  @Input() playersDict: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  getNumber(playerId: string) {
    if (playerId == null) return '?';

    return playerId.split('_').pop();
  }

  getPlayerName(playerId: string) {
    const player = this.playersDict[playerId];

    return player == null ? '' : player.firstName + ' ' + player.lastName;
  }
}
