const   express = require('express'),
        router = express.Router(),
        API_SETTINGS = require('../../configs'),
        routes = {};

// GET /status
routes.getStatus = function (req, res) {

    res.status(200).send({
        "Success": true,
        "Data": {
            "Message": "I am working!! Version: " + API_SETTINGS.version
        }
    });
};

module.exports = routes;

