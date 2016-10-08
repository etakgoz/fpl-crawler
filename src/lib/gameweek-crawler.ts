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
        let gameweeks = [1, 2, 3, 4, 5];
        return gameweeks;
    }

    public static getCurrentGameweek(): number {
        let gameweeks = this.getGameweeks();

        return gameweeks[gameweeks.length - 1];
    }

}
