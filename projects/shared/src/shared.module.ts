import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JerseyComponent,
  JerseyFrontComponent,
  PlayerInfoDialogComponent,
  RosterComponent,
  TournamentSelectorComponent,
} from './public-api';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

const SHARED_COMPONENTS: Type<any>[] = [
  TournamentSelectorComponent,
  JerseyComponent,
  JerseyFrontComponent,
  RosterComponent,
  PlayerInfoDialogComponent,
];

const SHARED_MODULES: Type<any>[] = [MatToolbarModule, MatCardModule];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, RouterModule, ...SHARED_MODULES],
  exports: [...SHARED_COMPONENTS, ...SHARED_MODULES],
})
export class SharedModule {}
