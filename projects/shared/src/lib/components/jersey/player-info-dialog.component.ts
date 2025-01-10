import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-player-info-dialog',
  templateUrl: './player-info-dialog.component.html',
  styleUrls: ['./player-info-dialog.component.scss'],
})
export class PlayerInfoDialogComponent {
  totalGames = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { player: any; team?: any }
  ) {
    if (data.team) {
      this.totalGames =
        (data.team.homeWins || 0) +
        (data.team.homeLosses || 0) +
        (data.team.awayWins || 0) +
        (data.team.awayLosses || 0) +
        (data.team.draws || 0);
    }
  }
}
