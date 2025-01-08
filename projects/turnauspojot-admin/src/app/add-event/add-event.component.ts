import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { GameEvent, Goal, Penalty } from '../game-plan/game-event';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbService } from 'shared';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit, OnDestroy {
  get goal(): Goal | null {
    return this.event != null && this.event.eventType === 'goal'
      ? <Goal>this.event
      : null;
  }

  get penalty(): Penalty | null {
    return this.event != null && this.event.eventType === 'penalty'
      ? <Penalty>this.event
      : null;
  }

  constructor(
    private db: DbService,
    private dialog: MatDialogRef<AddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.penaltyReasons.sort((a, b) => a.localeCompare(b));
  }

  teams: any[] = [];
  event?: GameEvent;

  minutes?: { readable: string; minutes: number };

  private players: any[] = [];

  private eventSubscription?: Subscription;

  penaltyMinutes: { readable: string; minutes: number }[] = [
    { readable: '3 min', minutes: 3 },
    { readable: '3 + 3 min', minutes: 6 },
    { readable: '10 min (henkilökohtainen)', minutes: 10 },
    { readable: '3 + 10 min (henkilökohtainen)', minutes: 13 },
    { readable: '8 + 20 min (ulosajo)', minutes: 28 },
  ];

  penaltyReasons: string[] = [
    'Käytösrangaistus',
    'PR Pelirangaistus',
    'OR Ottelurangaistus',
    'Varusteiden korjaaminen',
    'Laitataklaus',
    'Rikkoutunut maila',
    'Ryntäys',
    'Poikittainen maila',
    'Pelin viivyttäminen',
    'Kyynärpäätaklaus',
    'Väkivaltaisuus',
    'Nyrkkitappelu',
    'OR Kohtuuttoman kova peli',
    'Kiinnipitäminen',
    'Korkea maila',
    'Koukkaaminen',
    'Estäminen',
    'Huitominen',
    'Keihästäminen',
    'Mailan tai muun esineen heitto',
    'Kampitus',
    'JR Joukkuerangaistus',
    'Maalin tahallinen siirtäminen',
    'JR Liikaa pelaajia jäällä',
    'Kiekon peittäminen/sulkeminen',
    'Automaattinen käytösrangaistus',
    'Selästä taklaaminen',
    'Mailan päällä lyöminen',
    'JR Rikkeet aloituksessa / Liian myöh. al.kent.',
    'Polvitaklaus',
    'OR Päällä iskeminen',
    'Kiinnipitäminen vastustajan mailasta',
    'Leikkaaminen',
    'Vartalotaklaus',
    'JR Joukkuerangaistus toimihenkilölle',
    'PR Toimihenkilön pelirangaistus',
    'Sääntöjen vastainen varuste',
    'Sukeltaminen',
    'Pelin viivyttäminen kiekko katsomoon',
    'Vaarallinen varuste',
    'Päähän kohdistuva taklaus',
    'OR Toimihenkilön ottelurangaistus',
    'OR Potkaiseminen',
    'Pelaajan lähteminen pelaaja/rang. penkiltä',
    'PR Toimihenkilön lähteminen pelaajapenkiltä',
    'Maalivahdin muu pieni rangaistus',
    'JR Varusteiden aiheeton mittauspyyntö',
    'Veritartuntojen ehkäiseminen',
    'OR Yleisön estäminen',
    'PR Mailan tai muun esineen heitt. pelialueelta',
    'JR Kieltäytyminen pelin aloittamisesta',
    'JR Rikkeet vaihtotapahtumassa',
  ];
  scorerCtrl: UntypedFormControl = new UntypedFormControl();
  scorerChanged = false;

  assist1Ctrl: UntypedFormControl = new UntypedFormControl();
  assist1Changed = false;

  assist2Ctrl: UntypedFormControl = new UntypedFormControl();
  assist2Changed = false;

  pigCtrl: UntypedFormControl = new UntypedFormControl();
  pigChanged = false;

  static controlValue(c: UntypedFormControl) {
    if (c == null) {
      return null;
    }

    if (typeof c.value === 'string') {
      return null;
    }

    return c.value;
  }

  static playerId(c: UntypedFormControl): string | undefined {
    const player = AddEventComponent.controlValue(c);

    return player != null ? player.team + '_' + player.number : undefined;
  }

  ngOnInit() {
    console.log(JSON.stringify(this.data));
    console.log(this.data);

    const team = this.data['team'];
    const eventType = this.data['eventType'];
    const gameId = this.data['id'];
    const gameType = this.data['gameType'];
    const number = this.data['number'];
    const homeAway = this.data['homeAway'];
    const add = this.data['add'];
    const againstTeam = this.data['againstTeam'];

    this.players = this.data['players'];

    const key = gameId + '_' + number;

    this.eventSubscription = this.db
      .object<GameEvent>('events/' + key)
      .snapshotChanges()
      .subscribe((res) => {
        this.event = res.payload.val() ?? undefined;

        if (this.goal != null) {
          this.scorerCtrl.setValue(this.getPlayerById(this.goal.player ?? ''));
          this.assist1Ctrl.setValue(
            this.getPlayerById(this.goal.assist1 ?? '')
          );
          this.assist2Ctrl.setValue(
            this.getPlayerById(this.goal.assist2 ?? '')
          );
        }

        if (this.penalty != null) {
          this.pigCtrl.setValue(this.getPlayerById(this.penalty.player ?? ''));
        }

        if (this.event == null) {
          switch (eventType) {
            case 'goal':
              const goal = new Goal(
                team,
                gameId,
                gameType,
                number,
                eventType,
                homeAway,
                againstTeam
              );
              goal.score = add;
              this.event = goal;

              break;
            case 'penalty':
              this.event = new Penalty(
                team,
                gameId,
                gameType,
                number,
                eventType,
                homeAway,
                againstTeam
              );
              break;
            default:
              break;
          }
        }

        if (this.penalty != null) {
          this.minutes = {
            minutes: this.penalty.minutes ?? 0,
            readable: this.penalty.readable ?? '',
          };
        }

        console.log(this.event);
      });
  }

  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }

  getPlayer(number: string) {
    return this.players.find((p) => p.number === number);
  }

  onSubmit() {
    if (this.penalty != null && this.minutes != null) {
      this.penalty.minutes = this.minutes.minutes;
      this.penalty.readable = this.minutes.readable;
    }

    if (this.goal != null) {
      this.goal.player = AddEventComponent.playerId(this.scorerCtrl);
      this.goal.assist1 = AddEventComponent.playerId(this.assist1Ctrl);
      this.goal.assist2 = AddEventComponent.playerId(this.assist2Ctrl);
    }

    if (this.penalty != null) {
      this.penalty.player = AddEventComponent.playerId(this.pigCtrl);
    }

    this.db
      .list('events')
      .set(this.event?.id ?? '', this.event)
      .then(() => {
        this.dialog.close();
      });
  }

  getPlayerSelections(
    nullText: string | null = null,
    disallowed: (string | undefined)[] = []
  ) {
    const players = this.players.filter(
      (p) => !disallowed.includes(this.playerDisplayFn(p))
    );

    return nullText ? [nullText].concat(players) : players;
  }

  filterPlayers(
    search: string,
    filter: boolean = true,
    disallowed: (string | undefined)[] = [],
    nullText: string | null = null
  ): any[] {
    return !filter || search == null || search === ''
      ? this.getPlayerSelections(nullText, disallowed)
      : this.players
          .filter((p) => !disallowed.includes(this.playerDisplayFn(p)))
          .filter((p) =>
            this.playerDisplayFn(p)
              ?.toLowerCase()
              .includes(search.toLowerCase())
          );
  }

  playerDisplayFn(p?: any): string {
    if (typeof p === 'string') {
      return p;
    }

    const funName = p?.funName?.length > 0 ? '"' + p.funName + '" ' : '';
    return p ? `#${p.number} ${p.firstName} ${funName}${p.lastName}` : '';
  }

  getPlayerById(playerId: string) {
    return this.getPlayer(playerId.split('_').pop() ?? '');
  }

  removeEvent() {
    const confirmation = confirm(
      'Haluatko varmasti poistaa tapahtuman ' + this.event?.id + '?'
    );

    if (confirmation) {
      this.db
        .object('events/' + this.event?.id)
        .remove()
        .then(() => {
          this.dialog.close();
        });
    }
  }
}
