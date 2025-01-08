import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

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
export class TournamentSelectorComponent implements OnInit {
  tournaments: string[] = [];

  constructor(private router: Router, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db
      .object<{ [key: string]: any }>('/tournaments')
      .valueChanges()
      .subscribe(
        (tournaments) => {
          // Extract keys from the object
          this.tournaments = tournaments ? Object.keys(tournaments) : [];

          if (this.tournaments.length === 1) {
            this.selectTournament(this.tournaments[0]);
          }
        },
        (error) => {
          console.error('Error fetching tournaments:', error);
        }
      );
  }

  selectTournament(tournament: string) {
    this.router.navigate([`/${tournament}`]); // Navigate to the selected tournament
  }
}
