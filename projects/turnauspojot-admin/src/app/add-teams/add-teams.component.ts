import { Component } from '@angular/core';
import { DbService } from 'shared';

@Component({
  selector: 'app-add-teams',
  templateUrl: './add-teams.component.html',
  styleUrls: ['./add-teams.component.scss'],
})
export class AddTeamsComponent {
  team: any = {};

  constructor(private db: DbService) {}

  onSubmit() {
    this.db
      .list('teams')
      .set(this.team.id, this.team)
      .then(() => {
        this.team = {};
        console.log('success');
      });
  }
}
