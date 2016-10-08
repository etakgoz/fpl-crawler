import * as express from "express";

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

    public static respondError(res: express.Response, statusCode: number, message: any): void {
        res.status(statusCode).json({
            "Success": false,
            "Data": {
                "Message": message
            }
        });
    }
}
