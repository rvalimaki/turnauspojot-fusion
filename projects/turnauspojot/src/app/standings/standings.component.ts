import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { TitleService } from '../title.service';
import { Subscription } from 'rxjs';
import { DbService } from 'shared';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit, OnDestroy {
  @Input() title: string | null = 'Sarjataulukko';

  constructor(private db: DbService, private titleService: TitleService) {}
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
        this.players = players;
      });

    this.teamSubscription = this.db
      .listValueChanges('teams')
      .subscribe((teams) => {
        this.teams = teams;

        this.sortTeams();
      });
  }

  private sortTeams() {
    this.teams.sort((a, b) => {
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

      if (a.goalDiff > b.goalDiff) {
        return -1;
      }
      if (a.goalDiff < b.goalDiff) {
        return 1;
      }

      if (a.goalsFor > b.goalsFor) {
        return -1;
      }
      if (a.goalsFor < b.goalsFor) {
        return 1;
      }

      if (a.penaltiesTaken > b.penaltiesTaken) {
        return 1;
      }
      if (a.penaltiesTaken < b.penaltiesTaken) {
        return -1;
      }

      if (a.penaltiedDrawn > b.penaltiedDrawn) {
        return -1;
      }
      if (a.penaltiedDrawn < b.penaltiedDrawn) {
        return 1;
      }

      if (a.random > b.random) {
        return -1;
      }
      if (a.random < b.random) {
        return 1;
      }

      return 0;
    });
  }
}
