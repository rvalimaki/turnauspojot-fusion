import { Component, Input, OnInit } from '@angular/core';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { Helpers } from '../top-scorers/helpers';
import { TeamLogoService } from 'shared';
import { DbService } from 'shared';

@Component({
  selector: 'app-top-playmakers',
  templateUrl: './top-playmakers.component.html',
  styleUrls: ['./top-playmakers.component.scss'],
})
export class TopPlaymakersComponent implements OnInit {
  @Input() title: string | null = 'Pelintekijävelhot';
  @Input() limit = 100;

  constructor(
    private db: DbService,
    private titleService: TitleService,
    private logos: TeamLogoService
  ) {}

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
      if (b.assists == null) {
        return -1;
      }
      if (a.assists == null) {
        return 1;
      }

      if (a.assists > b.assists) {
        return -1;
      }
      if (a.assists < b.assists) {
        return 1;
      }

      if (a.primaryAssists > b.primaryAssists) {
        return -1;
      }
      if (a.primaryAssists < b.primaryAssists) {
        return 1;
      }

      if (a.goals > b.goals) {
        return -1;
      }
      if (a.goals < b.goals) {
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
