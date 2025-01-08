import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from 'firebase/auth';
import { TournamentService } from 'shared';

@Component({
  selector: 'app-nav',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport="true"
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="!(isHandset$ | async)"
      >
        <mat-toolbar>Valikko</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item [routerLink]="['/']">Valitse turnaus</a>
          <a
            mat-list-item
            *ngIf="tournament.name"
            [routerLink]="['/', tournament.name, 'game-plan']"
            >Pelit</a
          >
          <a
            mat-list-item
            *ngIf="tournament.name"
            [routerLink]="['/', tournament.name, 'view-teams']"
            >Joukkueet</a
          >
          <a
            mat-list-item
            *ngIf="tournament.name"
            [routerLink]="['/', tournament.name, 'general']"
            >Asetukset</a
          >
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Turnauspojot - </span>
          <span *ngIf="tournament.name"> {{ tournament.name }} </span>
          <span *ngIf="user | async as user"
            >&nbsp;{{ user.displayName }}
            <button (click)="signOut()">Kirjaudu ulos</button></span
          >
        </mat-toolbar>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  isHandset$: Observable<boolean>;

  user: Observable<User | null>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    public tournament: TournamentService // Inject TournamentService
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));

    this.user = this.authService.getUser();
  }

  signOut() {
    this.authService.signOut();
  }
}
