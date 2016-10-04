const   express = require('express'),
        router = express.Router(),
        LeagueCrawler = require('../../lib/league-crawler.js'),
        API_SETTINGS = require('../../configs'),
        routes = {};

// GET /crawl/gw/:gw
routes.crawlGameweek = function (req, res) {
    const gameweek = parseInt(req.params.gw, 10);

    res.status(200).send({
        "Success": true,
        "Data": {
            "Message": "Crawl Gamweek called. GW: " + gameweek
        }
    });
};

// GET /crawl/league/:id
routes.crawlLeague = function (req, res) {
    const itemId = parseInt(req.params.id, 10);

    res.status(200).send({
        "Success": true,
        "Data": {
            "Message": "Crawl League called. ID: " + id
        }
    });
};

module.exports = routes;
