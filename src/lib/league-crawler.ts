import * as request from "request";
import Player from "./player";
import Config from "../configs/config";
import Util from "./util";

export default class LeagueCrawler {
    constructor (private leagueId: number) {}

    getId() {
        return this.leagueId;
    }

    crawlPlayers() : Promise <Player[]> {
        Config.logger.log('info', `Started crawling league: ${this.leagueId}`);

        return new Promise ((resolve, reject) => {
            request(this.getLeagueDataUrl(), (error, response, jsonString) => {
                if (!error && response.statusCode == 200) {
                    let leagueData = JSON.parse(jsonString),
                        results = leagueData.standings.results,
                        players: Player[] = results.map(result => {

                            return {
                                name: Util.titleCase(result["player_name"]),
                                team: Util.titleCase(result["entry_name"]),
                                id: <string> result["id"]
                            }
                        });

                    Config.logger.log('info', 'Crawled players: ' + players.map(player => player.name).join(', '));

                    resolve(players);
                } else {
                    Config.logger.log('error', 'Failed at crawling ' + error.getMessage());
                    reject(error);
                }
            });
        });
    }

    savePlayers(players: Player[]) {
        const firebase = require('firebase');
        firebase.initializeApp(Config.firebaseConfig);
        const firePlayers = firebase.database().ref('/programmers');

        firePlayers.set({
          alanisawesome: {
            date_of_birth: "June 23, 1912",
            full_name: "Alan Turing"
          },
          gracehop: {
            date_of_birth: "December 9, 1906",
            full_name: "Grace Hopper"
          }
        });
    }

    getPlayers() {
        if(!this.isTeamsCrawledBefore()) {
            // this.crawlTeams()
            // return teams...
        }

        // return teams..
    }

    isTeamsCrawledBefore() : boolean {
        // TODO: check teams
        return false;
    }

    private getLeagueDataUrl(): string {
        return `https://fantasy.premierleague.com/drf/leagues-classic-standings/${this.leagueId}?phase=1&le-page=1&ls-page=1`;
    }
}
