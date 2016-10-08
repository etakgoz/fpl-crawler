import * as express from "express";
import Config from "../configs/config";
import GameweekCrawler from "../lib/gameweek-crawler";
import Util from "../lib/util";

const gameweekCrawler = new GameweekCrawler(Config.getFirebaseDb());

export default class GameweekRoute {
    constructor(app : express.Express) {
        GameweekRoute.activate(app);
    }

    public static activate (app : express.Express) : void {

        app.route("/gameweek/current")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                gameweekCrawler
                    .getCurrentGameweek()
                    .then(gameweekId => {
                        Util.respondSuccess(res, {
                            "GameweekId": gameweekId
                        });
                    })
                    .catch(error => Util.respondError(res, 500, error));
            })
            .post((req: express.Request, res: express.Response, next: Function): void => {
                const newCurrentGameweekId = req.body.gameweekId;

                gameweekCrawler
                    .setCurrentGameweek(newCurrentGameweekId)
                    .then(success => {
                        Util.respondSuccess(res, {
                            "Message": `Current gameweek id updated to the ${newCurrentGameweekId}`
                        });
                    })
                    .catch(error => Util.respondError(res, 500, error));
            });

        /*
        app.route("/player/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .crawl()
                    .then((players) => playerCrawler.savePlayers(players));

                // TODO: Catch errors and log them

                Util.respondSuccess(res, {
                    "Message": `Crawling of the league with the id: ${Config.leagueId} started.`
                });
            });

        app.route("/player/:id")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                const playerId = req.params.id;
                playerCrawler
                    .getPlayers()
                    .then(players => {
                        let filteredPlayers = players.filter(player => {
                            return player.id === playerId
                        });

                        if (filteredPlayers.length > 0) {
                            Util.respondSuccess(res, {
                                "Player": filteredPlayers[0]
                            });
                        } else {
                            Util.respondError(res, 404, `The player with the id: ${playerId} does not exist.`);
                        }

                    })
                    .catch(error => Util.respondError(res, 500, error));
            });


        app.route("/player")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .getPlayers()
                    .then(players => {
                        Util.respondSuccess(res, {
                            "LeagueId": Config.leagueId,
                            "Players": players
                        });
                    })
                    .catch(error => Util.respondError(res, 500, error));
            });
        */


    }
}
