import * as express from "express";
import config from "../configs/config";
import LeagueCrawler from "../lib/league-crawler";

export default class LeagueRoute {
    constructor(app : express.Express) {
        LeagueRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/league/crawl")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                let leagueCrawler = new LeagueCrawler(config.leagueId);
                console.log(leagueCrawler.getLeagueDataUrl());


                res.status(200).send({
                    "Success": true,
                    "Data": {
                        "Message": "This will crawl league data for the league with the id: " + config.leagueId
                    }
                });
            });
    }
}
