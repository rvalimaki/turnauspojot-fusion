import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private tournamentSubject = new BehaviorSubject<string | null>(null);
  tournament$ = this.tournamentSubject.asObservable();

  currentTournament = '';

  setTournament(tournament: string | undefined) {
    if (tournament == null) {
      return;
    }

    if (tournament != this.currentTournament) {
      console.log('Switching to tournament: ' + tournament);

      this.currentTournament = tournament;
      this.tournamentSubject.next(tournament);
    }
  }

  get name(): string | null {
    return this.tournamentSubject.value;
  }
}
