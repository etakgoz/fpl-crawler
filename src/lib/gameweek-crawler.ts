export default class GameweekCrawler {
    constructor () {}

    public static crawlGameweekData(teamId:number, gameweek: number) {
        // will crawl team data
    }

    public static saveGameweekData(teamId:number, gameweekData) {
        // will save team data to firebase
    }

    public static crawlGameweekStatus() {
    }

    public static getGameweeks(): number[] {

    }

    public static getCurrentGameweek(): number {
        let gameweeks = this.getGameweeks();

        return gameweeks[gameweeks.length - 1];
    }

}
