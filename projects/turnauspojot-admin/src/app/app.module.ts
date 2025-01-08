import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';

import { AddTeamsComponent } from './add-teams/add-teams.component';
import { ViewTeamsComponent } from './view-teams/view-teams.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { GameComponent } from './game/game.component';
import { GamePlanComponent } from './game-plan/game-plan.component';
import { AddGameComponent } from './add-game/add-game.component';
import { AddEventComponent } from './add-event/add-event.component';
import { GeneralComponent } from './general/general.component';

import { firebaseConfig } from './firebaseConfig';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';

import { registerLocaleData } from '@angular/common';
import localeFi from '@angular/common/locales/fi';
import { SharedModule } from 'shared';
import { TournamentSelectorComponent } from 'shared';

registerLocaleData(localeFi);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AddTeamsComponent,
    ViewTeamsComponent,
    EditTeamComponent,
    AddPlayerComponent,
    GameComponent,
    GamePlanComponent,
    AddGameComponent,
    AddEventComponent,
    GeneralComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LayoutModule,
    MatDialogModule,
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

    RouterModule.forRoot([
      {
        path: '',
        component: TournamentSelectorComponent, // Redirect root path to the tournament selection
      },
      {
        path: ':tournament',
        component: NavComponent,
        children: [
          { path: 'add-teams', component: AddTeamsComponent },
          { path: 'add-game/:key', component: AddGameComponent },
          { path: 'view-teams', component: ViewTeamsComponent },
          { path: 'edit-team/:key', component: EditTeamComponent },
          { path: 'add-player/:teamId/:key', component: AddPlayerComponent },
          { path: 'game-plan', component: GamePlanComponent },
          { path: 'game/:key', component: GameComponent },
          { path: 'general', component: GeneralComponent },
        ],
      },
    ]),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fi-FI' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
