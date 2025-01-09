import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { Helpers } from '../top-scorers/helpers';
import { TeamLogoService } from 'shared';
import { DbService } from 'shared';

@Component({
  selector: 'app-total-pigs',
  templateUrl: './total-pigs.component.html',
  styleUrls: ['./total-pigs.component.scss'],
})
export class TotalPigsComponent implements OnInit, OnDestroy {
  @Input() title: string | null = 'Sikaosasto';
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
          (p) => p.penalties != null && p.penalties > 0
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
      if (b.penalties == null) {
        return -1;
      }
      if (a.penalties == null) {
        return 1;
      }

      if (a.penalties > b.penalties) {
        return -1;
      }
      if (a.penalties < b.penalties) {
        return 1;
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
