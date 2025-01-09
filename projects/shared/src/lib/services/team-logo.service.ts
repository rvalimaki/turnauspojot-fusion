import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class TeamLogoService implements OnDestroy {
  private teamLogos: any = {};
  private teamSubscription?: Subscription;

  constructor(private db: DbService) {
    this.teamSubscription = this.db
      .listValueChanges('teams')
      .subscribe((teams) => {
        for (const team of teams) {
          this.teamLogos[(<any>team).id] = (<any>team).logo;
        }
      });
  }

  ngOnDestroy(): void {
    this.teamSubscription?.unsubscribe();
  }

  logo(teamId: string) {
    return this.teamLogos[teamId] != null
      ? this.teamLogos[teamId]
      : 'unknown.png';
  }
}
