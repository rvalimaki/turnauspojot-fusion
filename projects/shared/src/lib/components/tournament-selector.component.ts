import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-tournament-selector',
  template: `
    <h1 *ngIf="tournaments.length == 0">Ladataan...</h1>
    <div *ngIf="tournaments.length > 0">
      <h1>Valitse turnaus:</h1>
      <ul>
        <li
          *ngFor="let tournament of tournaments"
          (click)="selectTournament(tournament)"
        >
          {{ tournament }}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./tournament-selector.component.scss'],
})
export class TournamentSelectorComponent implements OnInit, OnDestroy {
  tournaments: string[] = [];

  subscription?: Subscription;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private tournamentService: TournamentService
  ) {}

  ngOnInit() {
    this.subscription = this.db
      .object<{ [key: string]: any }>('/tournaments')
      .valueChanges()
      .subscribe({
        next: (tournaments) => {
          // Extract keys from the object
          this.tournaments = tournaments ? Object.keys(tournaments) : [];

          if (
            this.tournaments.length === 1 &&
            this.tournaments[0] != '' &&
            this.tournaments[0] != this.tournamentService.name
          ) {
            this.selectTournament(this.tournaments[0]);
          }
        },
        error: (error) => {
          console.error('Error fetching tournaments:', error);
        },
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  selectTournament(tournament: string) {
    this.router.navigate([`/${tournament}`]); // Navigate to the selected tournament
  }
}
