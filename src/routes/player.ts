import * as express from "express";
import Config from "../configs/config";
import PlayerCrawler from "../lib/player-crawler";
import Util from "../lib/util";

export default class PlayerRoute {
    constructor(app : express.Express) {
        PlayerRoute.activate(app);
    }

    public static activate (app : express.Express) : void {

        const leagueId = Config.getSetting("leagueId");
        const playerCrawler = new PlayerCrawler(leagueId, Config.getFirebaseDb());

        app.route("/player/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .crawl()
                    .then(players => playerCrawler.savePlayers(players))
                    .then(savedPlayers => {
                        Util.logInfo('GET /player/crawl',
                                     'Crawled and saved players: ' + savedPlayers.map(player => player.name).join(','));
                    })
                    .catch(error => {
                        Util.logError('GET /player/crawl',
                                      `Error while crawling players - Message: ${error.message}`);
                    });

                Util.respondSuccess(res, {
                    "Message": `Crawling of the league with the id: ${leagueId} has started.`
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
                            let error = new Error(`The player with the id: ${playerId} does not exist.`);

                            Util.logError(`GET /player/${playerId}`,
                                          `Error while searching for the player - Message: ${error.message}`);

                            Util.respondError(res, 404, error);
                        }

                    })
                    .catch(error => {
                        Util.logError(`GET /player/${playerId}`,
                                      `Error while getting players - Message: ${error.message}`);

                        Util.respondError(res, 500, error);
                    });
            });


        app.route("/player")
            .get((req: express.Request, res: express.Response, next: Function): void => {

                playerCrawler
                    .getPlayers()
                    .then(players => {
                        Util.respondSuccess(res, {
                            "LeagueId": leagueId,
                            "Players": players
                        });
                    })
                    .catch(error => {
                        Util.logError(`GET /player/`,
                                      `Error while getting players - Message: ${error.message}`);
                        Util.respondError(res, 500, error);
                    });
            });


    }
}
