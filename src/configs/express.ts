import * as bodyParser from "body-parser";
import Config from "./config";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";

export default function() {
    var app: express.Express = express();

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));


    // CORS Middleware
    var allowCrossDomain = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

        next();
    };

    app.use(allowCrossDomain);

    // Favicon
    const favicon = require('serve-favicon');
    app.use(favicon('public/favicon.ico'));

    // Routes
    require("../routes/index").default(app);
    require("../routes/league").default(app);

    // catch 404 and forward to error handler
    app.use((req: express.Request, res: express.Response, next: Function): void => {
        let err: Error = new Error("Not Found");
        next(err);
    });

    // production error handler
    app.use((err: any, req: express.Request, res: express.Response, next): void => {
        res.status(err.status || 500).render("error", {
            message: err.message,
            error: {}
        });
    });

    if (app.get("env") === "development") {
        app.use((err: Error, req: express.Request, res: express.Response, next): void => {
            res.status(500).render("error", {
                message: err.message,
                error: err
            });
        });
    }

    return app;
};
