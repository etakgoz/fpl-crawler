import * as express from "express";
import Config from "../configs/config";
import PlayerCrawler from "../lib/player-crawler";

const firebase = require('firebase');
firebase.initializeApp(Config.firebaseConfig);

const playerCrawler = new PlayerCrawler(Config.leagueId, firebase.database());

export default class PlayerRoute {
    constructor(app : express.Express) {
        PlayerRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/player/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .crawl()
                    .then((players) => playerCrawler.savePlayers(players));

                // TODO: Catch errors and log them

                res.status(200).json({
                    "Success": true,
                    "Data": {
                        "Message": `Crawling of the league with the id: ${Config.leagueId} started.`
                    }
                });
            });

        app.route("/player")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .getPlayers()
                    .then((players) => {
                        res.status(200).json({
                            "Success": true,
                            "Data": {
                                "LeagueId": Config.leagueId,
                                "Players": players
                            }
                        });
                    })
                    .catch(error => {
                        res.status(500).json({
                            "Success": false,
                            "Data": {
                                "Message": error
                            }
                        });
                    });
            });
    }
}