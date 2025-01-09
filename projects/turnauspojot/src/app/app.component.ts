import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TournamentService } from 'shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'turnaus';

  constructor(
    private router: Router,
    private tournamentService: TournamentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events
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
