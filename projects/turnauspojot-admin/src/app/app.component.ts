import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { TournamentService } from 'shared';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet *ngIf="user | async as user; else signIn"></router-outlet>

    <ng-template #signIn>
      <button (click)="signInWithGoogle()">
        Kirjaudu sisään Google-tunnuksilla
      </button>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'turnaus-admin';

  user: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentService
  ) {
    this.user = this.authService.getUser();
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }

  ngOnInit() {
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getCurrentRoute();
        const tournamentName = currentRoute[0] || null; // Extract tournament name from the route
        this.tournamentService.setTournament(tournamentName ?? 'un-de-fi-ned');
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
