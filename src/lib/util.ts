import * as express from "express";
import * as winston from "winston";
import Config from "../configs/config";

export default class Util {
    public static titleCase (str: string): string {
        return str.split(' ').map(word => {
            if (word.toUpperCase() === word) {
                word = word.toLowerCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    public static respondSuccess(res: express.Response, data: Object): void {
        res.status(200).json({
            "Success": true,
            "Data": data
        });
    }

    public static respondError(res: express.Response, statusCode: number, error: Error): void {
        res.status(statusCode).json({
            "Success": false,
            "Data": {
                "Message": error.message
            }
        });
    }

    public static logger = new (winston.Logger)({
        transports: [
          new (winston.transports.File)({ filename: 'logs/fpl-crawler.log' })
        ]
    });

    public static logError(request: string, message: string): void {
        Util.logger.log('error', request + " - " + message);
    }

    public static logInfo(request: string, message: string): void {
        Util.logger.log('info', request + " - " + message);
    }
}
