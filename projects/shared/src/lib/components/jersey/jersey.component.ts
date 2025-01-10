import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { PlayerInfoDialogComponent } from './player-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-jersey',
  template: `
    <div class="name">{{ player?.lastName }}</div>
    <div class="number">{{ player?.number }}</div>
  `,
  styleUrls: ['./jersey.component.scss'],
})
export class JerseyComponent {
  @Input() player: any;
  @Input() team: any;
  @Input() color: string = '';

  constructor(private dialog: MatDialog) {}

  @HostListener('click')
  openPlayerDialog() {
    this.dialog.open(PlayerInfoDialogComponent, {
      data: { player: this.player, team: this.team },
      width: '400px',
    });
  }

  @HostBinding('class') get classes() {
    if (
      this.player == null ||
      this.player.position == null ||
      this.player.line == null
    ) {
      return 'hidden';
    }

    return `pos-${this.player.position} line-${this.player.line} ${this.color}`;
  }
}
