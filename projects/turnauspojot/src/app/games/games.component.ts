import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { Helpers } from '../top-scorers/helpers';
import { TeamLogoService } from 'shared';
import { DbService } from 'shared';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit, OnDestroy {
  title = 'Pelit';

  @Input() bet = true;

  constructor(
    private db: DbService,
    private titleService: TitleService,
    private logos: TeamLogoService
  ) {}
  ngOnDestroy(): void {
    this.playerSubscription?.unsubscribe();
    this.teamSubscription?.unsubscribe();
    this.gameSubscription?.unsubscribe();
    this.eventSubscription?.unsubscribe();
  }

  teams: any[] = [];
  games: any[] = [];
  players: any[] = [];
  events: any[] = [];

  eventsDict: any = {};
  playersDict: any = {};

  teamPlayersDict: any = {};

  selectedGame = '-0';

  private playerSubscription?: Subscription;
  private teamSubscription?: Subscription;
  private gameSubscription?: Subscription;
  private eventSubscription?: Subscription;

  ngOnInit() {
    if (this.title != null) {
      this.titleService.title = this.title;
    }

    this.gameSubscription = this.db
      .listValueChanges('games')
      .subscribe((games) => {
        this.games = games;

        this.sortGames();
      });

    this.playerSubscription = this.db
      .listValueChanges('players')
      .subscribe((players) => {
        this.players = players;

        this.playersDict = {};
        this.teamPlayersDict = {};

        for (const p of this.players) {
          this.playersDict[p.team + '_' + p.number] = p;

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

    this.eventSubscription = this.db
      .listValueChanges('events')
      .subscribe((events) => {
        this.events = events;
        this.events.sort((a, b) =>
          a.id.localeCompare(b.id, [], { numeric: true })
        );

        this.eventsDict = {};
        this.selectedGame = '-0';

        for (const e of this.events) {
          e.date = isNaN(e.timestamp) ? null : new Date(e.timestamp);

          if (this.eventsDict[e.gameId] == null) {
            this.eventsDict[e.gameId] = [];

            this.selectedGame = e.gameId;
          }

          this.eventsDict[e.gameId].push(e);
        }
      });
  }

  teamAbbr(team: string) {
    return Helpers.teamAbbreviation(team);
  }

  teamLogo(team: string) {
    return this.logos.logo(team);
  }

  private sortGames() {
    this.games.sort((a, b) => a.id.localeCompare(b.id, [], { numeric: true }));
  }

  lastEvent(id: any) {
    const events = this.eventsDict[id];
    if (events == null) {
      return null;
    }

    return events[events.length - 1];
  }
}
