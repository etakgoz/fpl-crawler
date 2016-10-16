import * as request from "request";
import Player from "./player";
import Config from "../configs/config";
import Util from "./util";

export default class PlayerCrawler {
    constructor (private leagueId: number, private firebaseDb: any) {}

    getId() {
        return this.leagueId;
    }

    crawl() : Promise <Player[]> {
        return new Promise ((resolve, reject) => {
            request(this.getLeagueDataUrl(), (error, response, jsonString) => {
                if (!error && response.statusCode == 200) {
                    let leagueData = JSON.parse(jsonString),
                        results = leagueData.standings.results,
                        players: Player[] = results.map(result => {

                            return {
                                name: Util.titleCase(result["player_name"]),
                                team: Util.titleCase(result["entry_name"]),
                                id: String(result["entry"])
                            }
                        });

                    resolve(players);
                } else {
                    reject(error);
                }
            });
        });
    }

    savePlayers(players: Player[]): Promise<Player[]> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref('/players').set(players, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(players);
                }
            });
        });
    }

    getPlayers(): Promise<Player[]> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref('/players').once('value', snapshot => {
                resolve(snapshot.val());
            }, error => {
                reject(error);
            });
        });
    }

    private getLeagueDataUrl(): string {
        return `https://fantasy.premierleague.com/drf/leagues-classic-standings/${this.leagueId}?phase=1&le-page=1&ls-page=1`;
    }
}
