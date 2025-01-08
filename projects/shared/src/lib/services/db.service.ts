import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  QueryFn,
} from '@angular/fire/compat/database';
import { TournamentService } from './tournament.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(
    private db: AngularFireDatabase,
    private tournament: TournamentService
  ) {}

  list<T>(path: string, queryFn?: QueryFn): AngularFireList<T> {
    return this.db.list(
      'tournaments/' + this.tournament.name + '/' + path,
      queryFn
    );
  }

  object<T>(path: string): AngularFireObject<T> {
    return this.db.object('tournaments/' + this.tournament.name + '/' + path);
  }
}
