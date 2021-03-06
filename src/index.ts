/**
 * FPL Crawler
 *
 * A node.js application implementing a REST API using express.js.
 * Capable of crawling fantasy premier league site
 *
 * @author Tolga Akgoz
 *
 */

import * as http from "http";
import Config from "./configs/config";


// Init the express application
const app = require("./configs/express").default();

const server: http.Server = http.createServer(app);
const port = Config.getSetting("port");

server.listen(port);

server.on("error", (e : Error) => {
  console.log("Error starting server" + e);
});

server.on("listening", () => {
  console.log("Server started on port " + port);
});
