export default class LeagueCrawler {
    constructor (private leagueId: number) {}

    getId() {
        return this.leagueId;
    }

    crawlTeams() {

    }

    saveTeams() {

    }

    getTeams() {
        if(!this.isTeamsCrawledBefore()) {
            // this.crawlTeams()
            // return teams...
        }

        // return teams..
    }

    isTeamsCrawledBefore() : boolean {
        // TODO: check teams
        return false;
    }

    private getLeagueDataUrl(): string {
        return `https://fantasy.premierleague.com/drf/leagues-classic-standings/${this.leagueId}?phase=1&le-page=1&ls-page=1`;
    }
}
