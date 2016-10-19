export default class Config {
    public static port : number = 4000;
    public static leagueId: number = 110296;
    public static version: string = "0.1";

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

    private static localSettings = null;

    public static setLocalSettings(settings: Object): void {
        if (typeof settings["firebaseConfig"] === "undefined") {
            throw new Error("Firebase configuration missing in local settings!");
        }

        this.localSettings = settings;
    }

    public static getSetting(name: string): any {
        return this.localSettings[name];
    }
}
