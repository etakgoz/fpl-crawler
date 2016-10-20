import * as request from "request";
import IPlayer from "./interface/player";
import Config from "../configs/config";
import Util from "./util";
import UrlBuilder from "./url-builder";

export default class PlayerCrawler {
    constructor (private leagueId: number, private firebaseDb: any) {}

    getId() {
        return this.leagueId;
    }

    crawl() : Promise <IPlayer[]> {
        return new Promise ((resolve, reject) => {
            const leagueDataUrl = UrlBuilder.getLeagueDataUrl(this.leagueId);

            request(leagueDataUrl, (error, response, jsonString) => {
                if (!error && response.statusCode == 200) {
                    let leagueData = JSON.parse(jsonString),
                        results = leagueData.standings.results,
                        players: IPlayer[] = results.map(result => {

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

    public savePlayers(players: IPlayer[]): Promise<IPlayer[]> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref(Config.getLeaguePrefix() + '/players').set(players, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(players);
                }
            });
        });
    }

    public getPlayers(): Promise<IPlayer[]> {
        return new Promise((resolve, reject) => {
            this.firebaseDb.ref(Config.getLeaguePrefix() + '/players').once('value', snapshot => {
                resolve(snapshot.val());
            }, error => {
                reject(error);
            });
        });
    }
}
