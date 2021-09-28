const axios = require('axios');
const { errorMonitor } = require('events');

/************************************************************************************************************************************************************************
 * Extract controller will serve us to break down the information we received from the 'pull.js' controller,
 * This controller is not necessary for use in order to use the API. It was created in order to facilitate the work of extracting the information.
 ************************************************************************************************************************************************************************/

exports.getLastGamesArrayAndSummary = (req, res, next) => {
    const platform = req.params.platform;
    const username = req.params.username;

    var config = {
        method: 'get',
        url: `http://localhost:8080/pull/lastGamesData/${platform}/${username}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            console.log("Player Last Games Array Extract Succeeded!");
            res.status(200).json({ gamesArray: response.data.data.data.matches, summaryStats: response.data.data.data.summary });
        })
        .catch(function (error) {
            console.log("Player Last Games Array Extract Failed!");
            res.status(error.response.status).json(error);
        });
};


exports.getLifetimeAndWeeklyStats = (req, res, next) => {
    const platform = req.params.platform;
    const username = req.params.username;

    var config = {
        method: 'get',
        url: `http://localhost:8080/pull/lifetimeData/${platform}/${username}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            console.log("Player Lifetime & Weekly Stats Extract Succeeded!");
            res.status(200).json({ br_lifetime_data: response.data.data.data.lifetime.mode.br.properties, weeklyStats: response.data.data.data.weekly });
            return;
        })
        .catch(function (error) {
            console.log("Player Lifetime & Weekly Stats Extract Failed!");
            if(error.response) {
                res.status(error.response.status).json(error);
                return;
            }
            res.status(500).json(error);
            return;
        });
};

exports.getAllPlayersFromGame = (req, res, next) => {
    const gameId = req.params.gameId;

    var config = {
        method: 'get',
        url: `http://localhost:8080/pull/gameStats/${gameId}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            console.log("Player Array From Spesefic Game Extract Succeeded!");
            res.status(200).json({ allPlayers: response.data.data.data.allPlayers });
        })
        .catch(function (error) {
            console.log("Player Array From Spesefic Game Extract Failed!");
            res.status(error.response.status).json(error);
        });
};