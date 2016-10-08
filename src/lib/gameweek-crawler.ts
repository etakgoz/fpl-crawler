import * as request from "request";
import Gameweek from "./gameweek";
import Player from "./player";
import Config from "../configs/config";
import Util from "./util";

export default class GameweekCrawler {
    private nGameWeeks = 38;

    constructor (private players: Player[], private firebaseDb: any) {}

    public saveGameweek(gameweek): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
            // TODO: will save gameweek data to firebase
        });
    }

    public crawlGameweek(gameweekId: number): Promise<Gameweek> {
        return new Promise((resolve, reject) => {
            // TODO: will crawl gameweek data for a specific gameweek (will be used for the latest)
        });

    }
    public saveGameweeks(gameweeks: Gameweek[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
            // TODO: will save gameweeks data to firebase
        });
    }

    public crawlGameweeks(): Promise<Gameweek[]> {
        return new Promise((resolve, reject) => {
            // TODO: will crawl gameweek data for specific gameweek
        });
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
