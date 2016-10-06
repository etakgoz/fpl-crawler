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
        // Try to access the firebase first, otherwise first run crawl
    }

    isTeamsCrawledBefore() : boolean {
        return false;
    }

    getGameweekStatus() {

    }

    private getLeagueDataUrl(): string {
        return `https://fantasy.premierleague.com/drf/leagues-classic-standings/${this.leagueId}?phase=1&le-page=1&ls-page=1`;
    }
}
