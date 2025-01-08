export class Helpers {
  static teamAbbreviation(team: string) {
    switch (team) {
      case 'PerHE++':
        return 'P++';
      default:
        return team;
    }
  }
}
