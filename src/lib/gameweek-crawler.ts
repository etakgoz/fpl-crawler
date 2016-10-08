export default class GameweekCrawler {
    private nGameWeeks = 38;

    constructor (private firebaseDb: any) {}

    public crawlGameweekData(teamId:number, gameweek: number) {
        // will crawl team data
    }

    public saveGameweekData(teamId:number, gameweekData) {
        // will save team data to firebase
    }

    public crawlGameweekStatus() {
    }

    public getCurrentGameweek(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref('/currentGameweek').once('value', snapshot => {
                resolve(snapshot.val());
            }, error => {
                reject(error);
            });
        });
    }

    public setCurrentGameweek(gameweekId: number): Promise<boolean> {

        return new Promise((resolve, reject) => {
            if (gameweekId > 0 || gameweekId < (this.nGameWeeks + 1)) {
                gameweekId = Math.floor(gameweekId);

                this.firebaseDb.ref('/currentGameweek').set(gameweekId, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                reject(new Error("Gameweek id must be an integer between 1 and 38!"));
            }
        });

    }

}
