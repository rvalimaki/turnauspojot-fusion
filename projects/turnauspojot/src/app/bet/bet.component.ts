import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bet',
  template: `
    Veikkaa avausmaalin tekijää ja voita makkara grillistä:
    <select
      name="teamSelect"
      [value]="homeAway"
      (change)="homeAway = teamSelect.value; players = getPlayers(homeAway)"
      #teamSelect
    >
      <option value="">-- valitse joukkue --</option>
      <option value="home">Koti ({{ this.game?.home }})</option>
      <option value="away">Vieras ({{ this.game?.away }})</option>
    </select>
    &nbsp;
    <select
      name="playerSelect"
      [value]="player"
      (change)="player = playerSelect.value"
      #playerSelect
    >
      <option [ngValue]="null">-- valitse pelaaja --</option>
      <option *ngFor="let p of players" [ngValue]="p">
        #{{ p.number }} {{ p.firstName }} {{ p.lastName }} {{ p.goals }}+{{
          p.assists
        }}={{ p.points }}
      </option>
    </select>

    Maalin syntyaika:
    <input type="tel" pattern="[0-9][0-9]" value="00" size="2" />:<input
      type="number"
      type="tel"
      pattern="[0-9][0-9]"
      size="2"
      value="00"
    />
  `,
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit {
  @Input() game: any;
  @Input() teamPlayersDict: any;

  homeAway = '';
  player = '';

  players: any[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  getPlayers(homeAway: string) {
    return this.teamPlayersDict[this.game[homeAway]] == null
      ? []
      : this.teamPlayersDict[this.game[homeAway]];
  }
}
