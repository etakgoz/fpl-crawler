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


        app.route("/gameweek/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                gameweekCrawler
                    .crawlGameweeks()
                    .then(gameweeks => gameweekCrawler.saveGameweeks(gameweeks));

                // TODO: Catch errors and log them

                Util.respondSuccess(res, {
                    "Message": `Crawling of the gameweeks for the league with id: ${Config.leagueId} started.`
                });
            });


        app.route("/gameweek/crawl/:id")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                const gameweekId = req.params.id;

                gameweekCrawler
                    .crawlGameweeks()
                    .then(gameweek => gameweekCrawler.saveGameweek(gameweek));

                // TODO: Catch errors and log them
                Util.respondSuccess(res, {
                    "Message": `Crawling of the gameweek(${gameweekId}) for the league with id: ${Config.leagueId} started.`
                });
            });

    }
}
