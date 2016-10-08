import * as express from "express";
import Config from "../configs/config";
import Util from "../lib/util";

export default class IndexRoute {
    constructor(app : express.Express) {
        IndexRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                Util.respondSuccess(res, {
                    "Message": "FPL Crawler is working. Version: " + Config.version
                });
            });
    }
}
