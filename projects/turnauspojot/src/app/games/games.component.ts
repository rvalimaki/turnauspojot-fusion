import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { Helpers } from '../top-scorers/helpers';
import { TeamLogoService } from '../services/team-logo.service';
import { DbService } from 'shared';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  title = 'Pelit';

  @Input() bet = true;

  constructor(
    private db: DbService,
    private titleService: TitleService,
    private logos: TeamLogoService
  ) {}

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
      .list('games')
      .valueChanges()
      .subscribe((games) => {
        this.games = games;

        this.sortGames();
      });

    this.playerSubscription = this.db
      .list('players')
      .valueChanges()
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
      .list('teams')
      .valueChanges()
      .subscribe((teams) => {
        this.teams = teams;
      });

    this.eventSubscription = this.db
      .list('events')
      .valueChanges()
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
