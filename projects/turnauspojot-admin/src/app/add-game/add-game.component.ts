import { Component, OnDestroy, OnInit } from '@angular/core';

import { ViewTeamsItem } from '../view-teams/view-teams-datasource';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { GAME_TYPES } from '../model/game-types';
import { DbService, TournamentService } from 'shared';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent implements OnInit, OnDestroy {
  teams: any[] = [];
  game: any = {};
  GAME_TYPES = GAME_TYPES;

  private subscription?: Subscription;
  private gameSubscription?: Subscription;

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
    private router: Router,
    public tournament: TournamentService
  ) {}

  ngOnInit() {
    const key = this.route.snapshot.params['key'];

    this.gameSubscription = this.db
      .object('games/' + key)
      .snapshotChanges()
      .subscribe((res) => {
        this.game = res.payload.val();

        if (this.game == null) {
          this.game = { id: key };
        }
      });

    this.subscription = this.db
      .list<ViewTeamsItem>('teams')
      .valueChanges()
      .subscribe((data) => {
        this.teams = data;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();

    this.gameSubscription?.unsubscribe();
  }

  onSubmit() {
    this.db
      .list('games')
      .set(this.game.id, this.game)
      .then(() => {
        this.router
          .navigateByUrl('/' + this.tournament.name + '/game-plan')
          .then();
      });
  }
}
