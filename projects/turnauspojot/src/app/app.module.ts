import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { firebaseConfig } from './firebaseConfig';
import { NavComponent } from './nav/nav.component';
import { TopScorersComponent } from './top-scorers/top-scorers.component';
import { TotalPigsComponent } from './total-pigs/total-pigs.component';
import { StandingsComponent } from './standings/standings.component';
import { GamesComponent } from './games/games.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { TopGoalScorersComponent } from './top-goal-scorers/top-goal-scorers.component';
import { TopPlaymakersComponent } from './top-playmakers/top-playmakers.component';
import { GameEventComponent } from './game-event/game-event.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { BetComponent } from './bet/bet.component';
import { FormsModule } from '@angular/forms';
import { SharedModule, TournamentSelectorComponent } from 'shared';
import { TeamRostersComponent } from './team-rosters/team-rosters.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TopScorersComponent,
    TotalPigsComponent,
    StandingsComponent,
    GamesComponent,
    DashboardComponent,
    TopGoalScorersComponent,
    TopPlaymakersComponent,
    GameEventComponent,
    BetComponent,
    TeamRostersComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatGridListModule,

    SharedModule,

    RouterModule.forRoot(
      [
        {
          path: '',
          component: TournamentSelectorComponent, // Root path for tournament selection
        },
        {
          path: ':tournament',
          children: [
            {
              path: '',
              component: NavComponent, // Only this NavComponent handles navigation
              children: [
                { path: '', redirectTo: 'pelit', pathMatch: 'prefix' },
                { path: 'pelit', component: GamesComponent },
                { path: 'sarjataulukko', component: StandingsComponent },
                { path: 'pistekunkut', component: TopScorersComponent },
                { path: 'maalitykit', component: TopGoalScorersComponent },
                { path: 'pelintekijat', component: TopPlaymakersComponent },
                { path: 'sikaosasto', component: TotalPigsComponent },
                { path: 'kokoonpanot', component: TeamRostersComponent },
                { path: 'kooste', component: DashboardComponent },
              ],
            },
            {
              path: 'dashboard',
              component: DashboardComponent, // Standalone DashboardComponent without NavComponent
            },
          ],
        },
      ],
      { useHash: true }
    ),
    FormsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
