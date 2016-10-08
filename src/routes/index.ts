import * as express from "express";
import Config from "../configs/config";


export default class IndexRoute {
    constructor(app : express.Express) {
        IndexRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                res.status(200).json({
                    "Success": true,
                    "Data": {
                        "Message": "FPL Crawler is working. Version: " + Config.version
                    }
                });
            });
    }
}
