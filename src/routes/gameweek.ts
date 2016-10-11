import * as express from "express";
import Config from "../configs/config";
import GameweekCrawler from "../lib/gameweek-crawler";
import PlayerCrawler from "../lib/player-crawler";
import Util from "../lib/util";

export default class GameweekRoute {
    constructor(app : express.Express) {
        GameweekRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        const playerCrawler = new PlayerCrawler(Config.leagueId, Config.getFirebaseDb());

        app.route("/gameweek/current")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .getCurrentGameweek()
                        .then(gameweekId => {
                            Util.respondSuccess(res, {
                                "GameweekId": gameweekId
                            });
                        });
                })
                .catch(error => Util.respondError(res, 500, error));
            })
            .post((req: express.Request, res: express.Response, next: Function): void => {
                const newCurrentGameweekId = req.body.gameweekId;

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .setCurrentGameweek(newCurrentGameweekId)
                        .then(success => {
                            Util.respondSuccess(res, {
                                "Message": `Current gameweek id is updated to the ${newCurrentGameweekId}`
                            });
                        });
                })
                .catch(error => Util.respondError(res, 500, error));
            });


        app.route("/gameweek/result/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .getCurrentGameweek()
                        .then(currentGameweek => {
                            let gameweekCrawls = gameweekCrawler.crawlAllGameweekResults(currentGameweek);

                            gameweekCrawls.forEach(playerCrawls => {

                                Promise.all(playerCrawls)
                                    .then(results => gameweekCrawler.saveGameweekResults(results[0].gameweekId, results))
                                    .then(success => {
                                        // TODO: log success....
                                        console.log("results saved for gameweek...");
                                    })
                                    .catch(error => {
                                        // TODO: log error...
                                        console.log(error);
                                    });
                            });

                        })
                })
                .catch(error => {
                    // TODO: log error...
                    console.log(error);
                });

                Util.respondSuccess(res, {
                    "Message": `Crawling of the gameweeks for the league with id: ${Config.leagueId} has started.`
                });
            });


        app.route("/gameweek/result/crawl/:id")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                const gameweekId: number = parseInt(req.params.id, 10);

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    Promise.all(gameweekCrawler.crawlGameweekResults(gameweekId))
                        .then(results => gameweekCrawler.saveGameweekResults(gameweekId, results))
                        .then(success => {
                            // TODO: log success
                            console.log("resuls saved...");
                        })
                        .catch(error => {
                            // TODO: log error...
                            console.log(error);
                        });
                })
                .catch(error => {
                    // TODO: log error...
                    console.log(error);
                });

                Util.respondSuccess(res, {
                    "Message": `Crawling of the gameweek(${gameweekId}) for the league with id: ${Config.leagueId} has started.`
                });
            });

    }
}
