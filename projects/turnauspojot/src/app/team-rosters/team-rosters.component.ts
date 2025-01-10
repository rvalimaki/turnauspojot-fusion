import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { DbService } from 'shared';

@Component({
  selector: 'app-team-rosters',
  template: `
    <main>
      <table>
        <ng-container *ngFor="let t of teams; let i = index">
          <tr
            [class.odd]="i % 2 === 0"
            (click)="selectedTeam = t.id"
            style="cursor: pointer"
          >
            <td class="team-logo team-logo-6">
              <img src="/assets/logos/{{ t.logo }}" />
            </td>
            <td>
              <h2>{{ t.name }}</h2>
            </td>
            <td>
              <app-jersey-front
                [logo]="t.logo"
                [color]="t.color"
              ></app-jersey-front>
            </td>
            <td></td>
          </tr>
          <ng-container *ngIf="t.id === selectedTeam">
            <tr [class.odd]="i % 2 === 0">
              <td colSpan="4" style="padding: 2em;">
                <app-roster
                  [players]="teamPlayersDict[t.id]"
                  [color]="t.color"
                ></app-roster>
              </td>
            </tr>
          </ng-container>
        </ng-container>
      </table>
    </main>
  `,
  styleUrls: ['./team-rosters.component.scss'],
})
export class TeamRostersComponent implements OnInit, OnDestroy {
  title = 'Kokoonpanot';

  constructor(private db: DbService, private titleService: TitleService) {}

  teams: any[] = [];
  players: any[] = [];

  teamPlayersDict: any = {};

  selectedTeam = '-0';

  private playerSubscription?: Subscription;
  private teamSubscription?: Subscription;

  ngOnInit() {
    if (this.title != null) {
      this.titleService.title = this.title;
    }

    this.playerSubscription = this.db
      .listValueChanges('players')
      .subscribe((players) => {
        this.players = players;

        this.teamPlayersDict = {};

        for (const p of this.players) {
          if (this.teamPlayersDict[p.team] == null) {
            this.teamPlayersDict[p.team] = [];
          }

          this.teamPlayersDict[p.team].push(p);

          this.teamPlayersDict[p.team].sort((a, b) =>
            a.number.localeCompare(b.number, [], { numeric: true })
          );
        }
      });

    this.teamSubscription = this.db
      .listValueChanges('teams')
      .subscribe((teams) => {
        this.teams = teams;
      });
  }

  ngOnDestroy() {
    this.playerSubscription?.unsubscribe();
    this.teamSubscription?.unsubscribe();
  }
}
