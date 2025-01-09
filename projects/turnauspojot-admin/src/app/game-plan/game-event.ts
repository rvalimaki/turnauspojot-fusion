export class GameEvent {
  id: string;
  date: Date | null;
  timestamp: number;
  home: boolean = false;
  away: boolean = false;

  constructor(
    public team: string,
    public gameId: string,
    public gameType: string,
    public number: string,
    public eventType: string,
    homeAway: string,
    public againstTeam: string
  ) {
    this.date = new Date();
    this.timestamp = this.date.getTime();

    this.id = gameId + '_' + number;

    switch (homeAway) {
      case 'home':
        this.home = true;
        break;
      case 'away':
        this.away = true;
        break;
      default:
        break;
    }
  }
}

export class Goal extends GameEvent {
  constructor(
    team: string,
    gameId: string,
    gameType: string,
    number: string,
    homeAway: string,
    againstTeam: string,
    public score: string,
    public player: string | null = null,
    public assist1: string | null = null,
    public assist2: string | null = null
  ) {
    super(team, gameId, gameType, number, 'goal', homeAway, againstTeam);
  }
}

export class Penalty extends GameEvent {
  constructor(
    team: string,
    gameId: string,
    gameType: string,
    number: string,
    homeAway: string,
    againstTeam: string,
    public player: string | null = null,
    public readable: string | null = null,
    public minutes: number | null = null,
    public reason: string | null = null
  ) {
    super(team, gameId, gameType, number, 'penalty', homeAway, againstTeam);
  }
}
