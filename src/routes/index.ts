import * as express from "express";

export default class IndexRoute {
    constructor(app : express.Express) {
        IndexRoute.activate(app);
    }

    public static activate (app : express.Express) : void {
        app.route("/")
            .get((req: express.Request, res: express.Response, next: Function): void => {
                res.status(200).send({
                    "Success": true,
                    "Data": {
                        "Message": "FPL Crawler is working. Version: "
                    }
                });
            });
    }
}
