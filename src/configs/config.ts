import * as winston from "winston";

export default class Config {
    public static port : number = 4000;
    public static leagueId: number = 110296;
    public static version: string = "0.1";

    public static logger = new (winston.Logger)({
        transports: [
          new (winston.transports.File)({ filename: 'logs/fpl-crawler.log' })
        ]
    });

    private static firebaseConfig = {
      serviceAccount: {
          projectId: "fpl-test",
          client_email: "admin-468@fpl-test.iam.gserviceaccount.com",
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDr3yIiLm+NkG4f\nuzle0T4zl+G9pQm0qvHTuuqzCdyNrZMBSC7+VgJHNcCl5H4KTq94HGV9EP4LQd7+\nLtgj9imvQjIjSzmFfMJALfYTJuTZFe1cQk9PtiBAm8lG3RlgbIx6ntNfVsQmJK6x\nP5SwVRZeqLbjthKWw3bOFBERdPwVmHXamNHf6cf2YiGljA/ugB776WWqC/ZcZM/P\nU/dlK6Dae5qnzi75yqCmSn0kZmRYw2v9qH9tVleZajl2lQMyRx9x4CmHPksAyxpy\nJzzFIqOYBDw0HEcdn4kOtN+t2WdHLq1x2x8OyULntzq90EUTl/ibABlrenTvoF97\nX/YD295hAgMBAAECggEBAMZP04YDnrzaSwyYwDKNIIwGTcDCCrgA5dOLmxqu1uWz\nox53zzL9o2q1seSIiMQnxfXpgha1+7IBTvhM8GLD6+YzdK4h6Bnoe/Wz7unJUK2I\ndwmTotU1HkbT9FWFPXnJqg7KjJLjA4XCX7Ic7+mVkHpDxYkMovJpIvE/A962id+o\ns1ctzENzUcIqzGkLUD+Tzb9a2BRLcsaGXTRAdW0tt1kTL1l/X/fIyFn0D0g7BcAv\n+hx5zk3pZOoIdTT3PmqeXcNoKPgkAO82XeFBM2hUTU6wv/h24RS2KRq37b4YzRKz\ndRM6Bi4ssVBOyNxtjQMwy0eiIr27qznq366OBZ18xQECgYEA+zmaGoACZNIAR93u\ntEyqYS8om0wP4T0kZO4ge7pmFKfbGM4/rA1Q9Nwb4s3UNwsuDPiigZnbLpKc3H0j\nyxUDmiAwT3Ih1r8+9GSV/LEbWInMUDEwsQXRAnupfSyXF6vsVw/lN7GCKLCkgSnu\nmEZe9zElvd21Cm7KCHoW7NgAQPECgYEA8FrTWl6cC+pkiu7Xnhpq1cqFL00W3wAz\noNccjUXDFALRKIbsiQhR60wf3okgpHVZmBuUhw+1cf/gvsfBdW7bqXm1QhKijAm5\nZU9ra1zYyJwE59aaRh0gE/jDnsz+7dVcFjCuCY7f4TCg8EiSiGMsdYeBrDuAleTx\nx/T4V9NydHECgYEA45DRA/IyuOr1MCRbxtyvdWsHaG0k8U22OurtZ8Z4E3vdXoHt\ncUd6ruL3K6Jw+g9Zfox2f9lDjtNl3eBJXPtDEQjZWg2zk1gXib/XkVdIwxHHjliQ\nl7oCEzK7W9TZZKrqYg7W/nT/xyYDTbETHMKZ4WaWnn9HMBUdU0Jso8whprECgYEA\nh1vfI0mcv+kk7klMDLH78KK5FsZnVvcaHD6Iyda74g0kFZrGovWYjNa2K/E1/OhJ\nqKv/nYBvQuBDha2hea0Q8ASm26r697qSOkfbyv7i5zdWW+ozv8CvTBAQuuHfv7kk\nvypzGNbppjxopml4fG69nwLNOF3aMJBaya1gHrXqA0ECgYEAklAwjCzaDLHLmN3c\nyPyQczNymO9AvEWJBEuUiTsd4zkaeCzZvnhvxTekPlzbXXhu6yO7xowiBLi8WRue\nJsoaeeu4hxY7dfxKNPcfS6CV44OcR/AcVcNNweZn50ZsgxU4s89k2jq9Qw7GYQVh\n14W0ACgliitL+d/WR0Q8iIOq4VY=\n-----END PRIVATE KEY-----\n"
      },
      databaseURL: "https://fpl-test.firebaseio.com"
    };

    private static firebaseDb = null;

    public static getFirebaseDb() {

        if (this.firebaseDb !== null) {
            return this.firebaseDb;
        } else {
            const firebase = require('firebase');
            firebase.initializeApp(this.firebaseConfig);
            this.firebaseDb = firebase.database();
            return this.firebaseDb;
        }

    }
}
