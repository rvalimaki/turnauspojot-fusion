import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JerseyComponent,
  JerseyFrontComponent,
  RosterComponent,
  TournamentSelectorComponent,
} from './public-api';
import { RouterModule } from '@angular/router';

const SHARED_COMPONENTS: Type<any>[] = [
  TournamentSelectorComponent,
  JerseyComponent,
  JerseyFrontComponent,
  RosterComponent,
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, RouterModule],
  exports: [...SHARED_COMPONENTS],
})
export class SharedModule {}
