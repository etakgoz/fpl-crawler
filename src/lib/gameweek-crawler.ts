import * as request from "request";
import GameweekResult from "./gameweek-result";
import Player from "./player";
import Config from "../configs/config";
import Util from "./util";


export default class GameweekCrawler {
    private nGameWeeks = 38;

    constructor (private players: Player[], private firebaseDb: any) {}

    private isValidGameweekId(gameweekId: number): boolean {
        // Gameweek Id must be integer bigger than 0 and smaller than nGameWeeks + 1
        return ((gameweekId > 0 && gameweekId < (this.nGameWeeks + 1)) && gameweekId === Math.floor(gameweekId));
    }

    private getUrl(playerId: string, module: string, gameweekId?:number): string {
        if (module === "result") {
            return `https://fantasy.premierleague.com/drf/entry/${playerId}/event/${gameweekId}/picks`;
        }
    }


    public saveGameweekResults(gameweekId: number, results: GameweekResult[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.isValidGameweekId(gameweekId)) {
                this.firebaseDb.ref('/gameweeks/results/' + gameweekId).set(results, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                reject(new Error("In saveGameweekResults: Gameweek id must be an integer between 1 and 38! It is: " + gameweekId));
            }
        });
    }

    private crawlGameweekResultForPlayer(playerId: string, gameweekId: number): Promise<GameweekResult> {
        return new Promise((resolve, reject) => {
            const gameweekResultUrl = this.getUrl(playerId, "result", gameweekId);

            request(gameweekResultUrl, (error, response, jsonString) => {
                if (!error && response.statusCode == 200) {
                    let picksData = JSON.parse(jsonString),
                        result = picksData["entry_history"];

                    resolve({
                        playerId: playerId,
                        gameweekId: gameweekId,
                        points: result["points"],
                        nTransfers: result["event_transfers"],
                        transferCost: result["event_transfers_cost"],
                        activeChip: picksData["active_chip"]
                    });

                } else {
                    reject(new Error(`An error occurred while crawling gameweek data for player(${playerId}) and gameweek(${gameweekId})`));
                }
            });
        });
    }

    public crawlGameweekResults(gameweekId: number): Promise<GameweekResult> [] {
        return this.players.map(player => this.crawlGameweekResultForPlayer(player.id, gameweekId));
    }

    public crawlAllGameweekResults(currentGameweekId:number): Promise<GameweekResult>[][] {
        let gameweekCrawls = [];
        for (let i = 1; i < currentGameweekId + 1; i++ ) {
            gameweekCrawls.push(this.crawlGameweekResults(i));
        }
        return gameweekCrawls;
    }

    public getCurrentGameweek(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref('/gameweeks/current').once('value', snapshot => {
                resolve(snapshot.val());
            }, error => {
                reject(error);
            });
        });
    }

    public setCurrentGameweek(gameweekId: number): Promise<boolean> {

        return new Promise((resolve, reject) => {
            if (this.isValidGameweekId(gameweekId)) {
                this.firebaseDb.ref('/gameweeks/current').set(gameweekId, error => {
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
