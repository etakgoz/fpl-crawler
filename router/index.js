module.exports = function (app) {
    app.use('/status', require('./routes/status').getStatus);
};
