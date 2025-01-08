import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-tournament-selector',
  template: `
    <h1>Valitse turnaus:</h1>
    <ul>
      <li
        *ngFor="let tournament of tournaments"
        (click)="selectTournament(tournament)"
      >
        {{ tournament }}
      </li>
    </ul>
  `,
  styles: [
    `
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        cursor: pointer;
        padding: 10px;
        border: 1px solid #ddd;
        margin: 5px 0;
        background: #f9f9f9;
      }
      li:hover {
        background: #eee;
      }
    `,
  ],
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
