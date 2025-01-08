import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private tournamentSubject = new BehaviorSubject<string | null>(null);
  tournament$ = this.tournamentSubject.asObservable();

  setTournament(tournament: string) {
    this.tournamentSubject.next(tournament);
  }

  get name(): string | null {
    return this.tournamentSubject.value;
  }
}
