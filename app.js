/**
 * FPL Crawler
 *
 * A node.js application implementing a REST API using express.js.
 * Capable of crawling fantasy premier league site
 *
 * @author Tolga Akgoz
 *
 */


// Setup express app to server requests and document storage to serve documents
const   express = require('express'),
        compress = require('compression'),
        bodyParser = require('body-parser'),
        API_SETTINGS = require('./configs'),
        app = express();


//CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

    next();
};

app.use(allowCrossDomain);

app.use(bodyParser.json());

const router = require('./router')(app);

app.use(compress());

// Listen the port 3412 for the requests
const portToListen = process.env.PORT || 3412;

app.listen(portToListen);
console.log("Started listening at " + portToListen);
