import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../title.service';
import { Helpers } from './helpers';
import { TeamLogoService } from 'shared';
import { DbService } from 'shared';

@Component({
  selector: 'app-top-scorers',
  templateUrl: './top-scorers.component.html',
  styleUrls: ['./top-scorers.component.scss'],
})
export class TopScorersComponent implements OnInit, OnDestroy {
  @Input() title: string | null = 'Pistepörssi';
  @Input() limit = 100;

  constructor(
    private db: DbService,
    private titleService: TitleService,
    private logos: TeamLogoService
  ) {}
  ngOnDestroy(): void {
    this.playerSubscription?.unsubscribe();
    this.teamSubscription?.unsubscribe();
    this.gameSubscription?.unsubscribe();
  }

  teams: any[] = [];
  games: any[] = [];
  players: any[] = [];

  private playerSubscription?: Subscription;
  private teamSubscription?: Subscription;
  private gameSubscription?: Subscription;

  ngOnInit() {
    if (this.title != null) {
      this.titleService.title = this.title;
    }

    this.gameSubscription = this.db
      .listValueChanges('games')
      .subscribe((games) => {
        this.games = games;
      });

    this.playerSubscription = this.db
      .listValueChanges('players')
      .subscribe((players) => {
        this.players = (<any>players).filter(
          (p) => p.points != null && p.points > 0
        );

        this.sortPlayers();
      });

    this.teamSubscription = this.db
      .listValueChanges('teams')
      .subscribe((teams) => {
        this.teams = teams;
      });
  }

  private sortPlayers() {
    this.players.sort((a, b) => {
      if (b.points == null) {
        return -1;
      }
      if (a.points == null) {
        return 1;
      }

      if (a.points > b.points) {
        return -1;
      }
      if (a.points < b.points) {
        return 1;
      }

      if (a.goals > b.goals) {
        return -1;
      }
      if (a.goals < b.goals) {
        return 1;
      }

      if (a.primaryAssists > b.primaryAssists) {
        return -1;
      }
      if (a.primaryAssists < b.primaryAssists) {
        return 1;
      }

      if (a.penalties > b.penalties) {
        return 1;
      }
      if (a.penalties < b.penalties) {
        return -1;
      }

      if (a.number > b.number) {
        return 1;
      }
      if (a.number < b.number) {
        return -1;
      }

      if (a.team > b.team) {
        return 1;
      }
      if (a.team < b.team) {
        return -1;
      }

      return 0;
    });
  }

  teamAbbr(team: string) {
    return Helpers.teamAbbreviation(team);
  }

  teamLogo(team: string) {
    return this.logos.logo(team);
  }
}
