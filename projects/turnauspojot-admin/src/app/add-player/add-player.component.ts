import { Component, OnDestroy, OnInit } from '@angular/core';

import { ViewTeamsItem } from '../view-teams/view-teams-datasource';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DbService, TournamentService } from 'shared';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
})
export class AddPlayerComponent implements OnInit, OnDestroy {
  teams: any[] = [];
  positions: any[] = [
    { id: '', name: '?' },
    { id: 'MV', name: 'Maalivahti' },
    { id: 'VP', name: 'Vasen puolustaja' },
    { id: 'OP', name: 'Oikea puolustaja' },
    { id: 'VH', name: 'Vasen laitahyökkääjä' },
    { id: 'KH', name: 'Keskuhyökkääjä' },
    { id: 'OH', name: 'Oikea laitahyökkääjä' },
  ];
  lines: any[] = [
    { id: 1, name: '1.' },
    { id: 2, name: '2.' },
    { id: 3, name: '3.' },
    { id: 4, name: '4.' },
    { id: 0, name: 'Vilttiketju' },
  ];
  player: any = {};

  private subscription?: Subscription;
  private playerSubscription?: Subscription;

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
    private router: Router,
    public tournament: TournamentService
  ) {}

  ngOnInit() {
    this.player.team = this.route.snapshot.params['teamId'];

    const key = this.route.snapshot.params['key'];

    if (key != null && key !== '') {
      this.playerSubscription = this.db
        .objectValueChanges('players/' + key)
        .subscribe((p) => (this.player = p));
    }

    this.subscription = this.db
      .listValueChanges<ViewTeamsItem>('teams')
      .subscribe((data) => {
        this.teams = data;

        if (this.player.team == null && this.teams.length > 0) {
          this.player.team = this.teams[0].id;
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();

    this.playerSubscription?.unsubscribe();
  }

  onSubmit() {
    this.db
      .list('players')
      .set(this.player.team + '_' + this.player.number, this.player)
      .then(() => {
        this.router
          .navigateByUrl(
            '/' + this.tournament.name + '/edit-team/' + this.player.team
          )
          .then();
      });
  }
}
