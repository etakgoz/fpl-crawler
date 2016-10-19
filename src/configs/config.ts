export default class Config {

    public static version: string = "0.1";

    private static localSettings = null;

    public static setLocalSettings(settings: Object): void {
        if (typeof settings["firebaseConfig"] === "undefined") {
            throw new Error("Firebase configuration (firebaseConfig) missing in local settings!");
        }

        if (typeof settings["leagueId"] === "undefined") {
            throw new Error("League id (leagueId) is missing in local settings!");
        }

        if (typeof settings["port"] === "undefined") {
            throw new Error("Port (port) is missing in local settings!");
        }

        this.localSettings = settings;
    }

    public static getSetting(name: string): any {
        return this.localSettings[name];
    }

    private static firebaseDb = null;

    public static getFirebaseDb() {

        if (this.firebaseDb !== null) {
            return this.firebaseDb;
        } else {
            const firebase = require('firebase');

            firebase.initializeApp(this.localSettings["firebaseConfig"]);
            this.firebaseDb = firebase.database();

            return this.firebaseDb;
        }
    }
}
