import * as request from "request";
import IGameweekResult from "./interface/gameweek-result";
import IPlayer from "./interface/player";
import Config from "../configs/config";
import Util from "./util";
import UrlBuilder from "./url-builder";


export default class GameweekCrawler {
    private nGameWeeks = 38;

    constructor (private players: IPlayer[], private firebaseDb: any) {}

    private isValidGameweekId(gameweekId: number): boolean {
        // Gameweek Id must be integer bigger than 0 and smaller than nGameWeeks + 1
        return ((gameweekId > 0 && gameweekId < (this.nGameWeeks + 1)) && gameweekId === Math.floor(gameweekId));
    }

    public saveGameweekResults(gameweekId: number, results: IGameweekResult[]): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.isValidGameweekId(gameweekId)) {
                this.firebaseDb.ref(Config.getLeaguePrefix() + '/gameweeks/results/' + gameweekId).set(results, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(gameweekId);
                    }
                });
            } else {
                reject(new Error("In saveGameweekResults: Gameweek id must be an integer between 1 and 38! It is: " + gameweekId));
            }
        });
    }

    private crawlGameweekResultForPlayer(playerId: string, gameweekId: number): Promise<IGameweekResult> {
        return new Promise((resolve, reject) => {
            const gameweekResultUrl = UrlBuilder.getPicksUrl(playerId, gameweekId);

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
                    reject(new Error(error));
                }
            });
        });
    }

    public crawlGameweekResults(gameweekId: number): Promise<IGameweekResult> [] {
        return this.players.map(player => this.crawlGameweekResultForPlayer(player.id, gameweekId));
    }

    public crawlAllGameweekResults(currentGameweekId:number): Promise<IGameweekResult>[][] {
        let gameweekCrawls = [];
        for (let i = 1; i < currentGameweekId + 1; i++ ) {
            gameweekCrawls.push(this.crawlGameweekResults(i));
        }
        return gameweekCrawls;
    }

    public crawlCurrentGameweek(): Promise<number> {
        return new Promise((resolve, reject) => {
            const gameweekStatsUrl = UrlBuilder.getCurrentGameweekStatsUrl();

            request(gameweekStatsUrl, (error, response, jsonString) => {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(jsonString);

                    if (data["current-event"]) {
                        resolve(data["current-event"]);
                    } else {
                        reject(new Error('The current-event property is missing from the json data'));
                    }
                } else {
                    reject(error);
                }
            });
        });
    }

    public getCurrentGameweek(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref(Config.getLeaguePrefix() + '/gameweeks/current').once('value', snapshot => {
                resolve(snapshot.val());
            }, error => {
                reject(error);
            });
        });
    }

    public setCurrentGameweek(gameweekId: number): Promise<number> {

        return new Promise((resolve, reject) => {
            if (this.isValidGameweekId(gameweekId)) {
                this.firebaseDb.ref(Config.getLeaguePrefix() + '/gameweeks/current').set(gameweekId, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(gameweekId);
                    }
                });
            } else {
                reject(new Error("Gameweek id must be an integer between 1 and 38!"));
            }
        });

    }

}
