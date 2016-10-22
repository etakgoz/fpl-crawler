export default class UrlBuilder {
    public static getPicksUrl(playerId: string, gameweekId:number): string {
        return `https://fantasy.premierleague.com/drf/entry/${playerId}/event/${gameweekId}/picks`;
    }

    public static getLeagueDataUrl(leagueId: number): string {
        return `https://fantasy.premierleague.com/drf/leagues-classic-standings/${leagueId}?phase=1&le-page=1&ls-page=1`;
    }

    public static getCurrentGameweekStatsUrl(): string {
        return "https://fantasy.premierleague.com/drf/bootstrap-dynamic";
    }
}
