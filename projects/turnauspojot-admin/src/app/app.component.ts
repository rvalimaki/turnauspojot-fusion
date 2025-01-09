import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { TournamentService } from 'shared';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet *ngIf="user | async as user; else signIn"></router-outlet>

    <ng-template #signIn>
      <div style="width: 100vw; text-align: center; padding-top: 10vh">
        <button mat-raised-button color="primary" (click)="signInWithGoogle()">
          <mat-icon>login</mat-icon>
          Kirjaudu sisään Google-tunnuksilla
        </button>
      </div>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'turnaus-admin';

  user: Observable<User | null>;

  routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentService
  ) {
    this.user = this.authService.getUser();
  }
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }

  ngOnInit() {
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getCurrentRoute();
        const tournamentName = currentRoute[0]; // Extract tournament name from the route
        this.tournamentService.setTournament(tournamentName);
      });
  }

  private getCurrentRoute(): string[] {
    let route = this.activatedRoute.root;
    const segments: string[] = [];
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.url.length) {
        segments.push(...route.snapshot.url.map((segment) => segment.path));
      }
    }
    return segments;
  }
}
