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
        const leagueId = Config.getSetting("leagueId");
        const playerCrawler = new PlayerCrawler(leagueId, Config.getFirebaseDb());

        app.route("/gameweek/current/crawl")

            // STARTS CRAWLING CURRENT GAMEWEEK
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .crawlCurrentGameweek()
                        .then(gameweekId => gameweekCrawler.setCurrentGameweek(gameweekId))
                        .then(gameweekId => Util.logInfo(
                            'GET /gameweek/current/crawl',
                            `Crawled and set current gameweek to ${gameweekId}`
                        ))
                        .catch(error => Util.logError(
                            'GET /gameweek/current/crawl',
                            `Error while crawling current gameweek - Message: ${error.message}`
                        ));
                })
                .catch(error => Util.logError(
                    'GET /gameweek/current/crawl',
                    `Error while creating GameweekCrawler - Message: ${error.message}`
                ));

                Util.respondSuccess(res, {
                    "Message": 'Started crawling current gameweek.'
                });
            });

        app.route("/gameweek/current")

            // RETURNS CURRENT GAMEWEEK AS JSON
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .getCurrentGameweek()
                        .then(gameweekId => Util.respondSuccess(res, {
                                "GameweekId": gameweekId
                        }))
                        .catch(error => {
                            Util.respondError(res, 500, error);
                            Util.logError('GET /gameweek/current',
                                          `Error while getting current gameweek - Message: ${error.message}`);
                        });
                })
                .catch(error => {
                    Util.respondError(res, 500, error);
                    Util.logError('GET /gameweek/current',
                                  `Error while creating GameweekCrawler - Message: ${error.message}`);
                });
            })

            // SETS CURRENT GAMEWEEK
            .post((req: express.Request, res: express.Response, next: Function): void => {
                const newCurrentGameweekId = req.body.gameweekId;

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    gameweekCrawler
                        .setCurrentGameweek(newCurrentGameweekId)
                        .then(gameweekId => Util.respondSuccess(res, {
                            "Message": `Current gameweek id is updated to the ${gameweekId}`
                        }))
                        .catch(error => {
                            Util.respondError(res, 500, error);
                            Util.logError('POST /gameweek/current',
                                          `Error while setting current gameweek - Message: ${error.message}`);
                        });
                })
                .catch(error => {
                    Util.respondError(res, 500, error);
                    Util.logError('POST /gameweek/current',
                                  `Error while creating GameweekCrawler - Message: ${error.message}`);
                });
            });


        app.route("/gameweek/result/crawl")

            // STARTS CRAWLING ALL GAMEWEEK RESULTS
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
                                    .then(gameweekId => Util.logInfo(
                                        'GET /gameweek/result/crawl',
                                        `Crawled and saved results for gameweek ${gameweekId}`
                                    ))
                                    .catch(error => Util.logError(
                                        'GET /gameweek/result/crawl',
                                        `Error while crawling results - Message: ${error.message}`
                                    ));
                            });

                        })
                        .catch(error => Util.logError(
                            'GET /gameweek/result/crawl',
                            `Error while getting current gameweek - Message: ${error.message}`
                        ));
                })
                .catch(error => Util.logError(
                    'GET /gameweek/result/crawl',
                    `Error while creating GameweekCrawler - Message: ${error.message}`
                ));

                Util.respondSuccess(res, {
                    "Message": `Crawling of the gameweek results for the league with id: ${leagueId} has started.`
                });
            });


        app.route("/gameweek/result/crawl/:id")

            // CRAWLS RESULTS FOR A SPECIFIC GAMEWEEK
            .get((req: express.Request, res: express.Response, next: Function): void => {
                if (req.params.id === "current") {
                    return next();
                }

                const gameweekId: number = parseInt(req.params.id, 10);

                playerCrawler.getPlayers().then(players => {
                    return new GameweekCrawler(players, Config.getFirebaseDb());
                })
                .then(gameweekCrawler => {
                    Promise.all(gameweekCrawler.crawlGameweekResults(gameweekId))
                        .then(results => gameweekCrawler.saveGameweekResults(gameweekId, results))
                        .then(gameweekId => Util.logInfo(
                            `GET /gameweek/result/crawl/${gameweekId}`,
                            `Crawled and saved results for the gameweek ${gameweekId}`
                        ))
                        .catch(error => Util.logError(
                            `GET /gameweek/result/crawl/${gameweekId}`,
                            `Error in crawling results - Message: ${error.message}`
                        ));
                })
                .catch(error => Util.logError(
                    `GET /gameweek/result/crawl/${gameweekId}`,
                    `Error in creating GameweekCrawler - Message: ${error.message}`
                ));

                Util.respondSuccess(res, {
                    "Message": `Started crawling gameweek(${gameweekId}) result for the league with id: ${leagueId} has started.`
                });
            });


        app.route("/gameweek/result/crawl/current")

            // CRAWLS RESULTS FOR THE CURRENT GAMEWEEK
            .get((req: express.Request, res: express.Response, next: Function): void => {
                let gameweekCrawler: GameweekCrawler = null;

                playerCrawler.getPlayers().then(players => {
                    gameweekCrawler = new GameweekCrawler(players, Config.getFirebaseDb());
                    return gameweekCrawler;
                })
                .then(gameweekCrawler => gameweekCrawler.getCurrentGameweek())
                .then(currentGameweekId => {
                    Promise.all(gameweekCrawler.crawlGameweekResults(currentGameweekId))
                        .then(results => gameweekCrawler.saveGameweekResults(currentGameweekId, results))
                        .then(currentGameweekId => Util.logInfo(
                            `GET /gameweek/result/crawl/current`,
                            `Crawled and saved results for the last gameweek: ${currentGameweekId}`
                        ))
                        .catch(error => Util.logError(
                            `GET /gameweek/result/crawl/current`,
                            `Error in crawling results - Message: ${error.message}`
                        ));
                })
                .catch(error => Util.logError(
                    `GET /gameweek/result/crawl/current`,
                    `Error in creating GameweekCrawler - Message: ${error.message}`
                ));

                Util.respondSuccess(res, {
                    "Message": `Started crawling current gameweek results for the league with id: ${leagueId} has started.`
                });
            });

    }
}
