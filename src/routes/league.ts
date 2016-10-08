import * as express from "express";
import Config from "../configs/config";
import LeagueCrawler from "../lib/league-crawler";

export default class LeagueRoute {
    constructor(app : express.Express) {
        LeagueRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/league/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                let leagueCrawler = new LeagueCrawler(Config.leagueId);

                leagueCrawler.crawlPlayers().then((players) => leagueCrawler.savePlayers(players));

                // console.log(leagueCrawler.getLeagueDataUrl());

                res.status(200).send({
                    "Success": true,
                    "Data": {
                        "Message": `Crawling of the league with the id: ${Config.leagueId} started.`
                    }
                });
            });
    }
}
