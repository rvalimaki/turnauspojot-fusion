import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Colors, DbService, TournamentService } from 'shared';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss'],
})
export class EditTeamComponent implements OnInit, OnDestroy {
  team: any = {};

  subscription?: Subscription;
  playerSubscription?: Subscription;
  private _playerDict: any = {};

  colorOptions = Object.values(Colors);

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
    private router: Router,
    public tournament: TournamentService
  ) {}

  ngOnInit() {
    const key = this.route.snapshot.params['key'];

    this.subscription = this.db
      .objectValueChanges('teams/' + key)
      .subscribe((value) => (this.team = value));

    this.playerSubscription = this.db
      .listValueChanges('players')
      .subscribe((players) => {
        this.setPlayerDictionary(players);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
  }

  onSubmit() {
    this.db
      .list('teams')
      .set(this.team.id, this.team)
      .then(() => {
        console.log('success');
        this.router.navigateByUrl('/' + this.tournament.name + '/view-teams');
      });
  }

  getPlayers(team: string) {
    return this._playerDict[team] != null ? this._playerDict[team] : [];
  }

  private setPlayerDictionary(players: any[]) {
    this._playerDict = {};

    for (const p of players) {
      if (this._playerDict[p.team] == null) {
        this._playerDict[p.team] = [];
      }

      this._playerDict[p.team].push(p);
      this._playerDict[p.team].sort((a, b) =>
        a.number.localeCompare(b.number, [], { numeric: true })
      );
    }
  }

  removePlayer(key: string) {
    this.db
      .object('players/' + key)
      .remove()
      .then();
  }

  confirmRemovePlayer(key: string) {
    const confirmation = confirm(
      'Haluatko varmasti poistaa pelaajan ' + key + '?'
    );

    if (confirmation) {
      this.removePlayer(key);
    }
  }
}
