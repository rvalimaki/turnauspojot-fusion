import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  QueryFn,
  SnapshotAction,
} from '@angular/fire/compat/database';
import { TournamentService } from './tournament.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(
    private db: AngularFireDatabase,
    private tournament: TournamentService
  ) {}

  // --- VALUE CHANGES ---

  listValueChanges<T>(path: string, queryFn?: QueryFn): Observable<T[]> {
    return this.tournament.tournament$.pipe(
      switchMap((tournamentName) => {
        if (!tournamentName) return of([]);
        return this.db
          .list<T>(`tournaments/${tournamentName}/${path}`, queryFn)
          .valueChanges();
      })
    );
  }

  objectValueChanges<T>(path: string): Observable<T | null> {
    return this.tournament.tournament$.pipe(
      switchMap((tournamentName) => {
        if (!tournamentName) return of(null);
        return this.db
          .object<T>(`tournaments/${tournamentName}/${path}`)
          .valueChanges();
      })
    );
  }

  // --- STATIC METHODS FOR MODIFICATIONS ---

  list<T>(path: string, queryFn?: QueryFn): AngularFireList<T> {
    const tournamentName = this.tournament.name;
    if (!tournamentName) {
      throw new Error('No tournament selected');
    }
    return this.db.list(`tournaments/${tournamentName}/${path}`, queryFn);
  }

  object<T>(path: string): AngularFireObject<T> {
    const tournamentName = this.tournament.name;
    if (!tournamentName) {
      throw new Error('No tournament selected');
    }
    return this.db.object(`tournaments/${tournamentName}/${path}`);
  }
}
