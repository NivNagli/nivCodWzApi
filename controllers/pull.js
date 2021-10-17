const axios = require('axios');
const qs = require('qs');
const settings = require('./settings');
const ACT_SSO_COOKIE = settings.ACT_SSO_COOKIE;
const ACT_SSO_COOKIE_EXPIRY = settings.ACT_SSO_COOKIE_EXPIRY;
const atkn = settings.ATKN;

/************************************************************************************************************************************************************************
 * Pull controller will serve us for receving general data, with the help of this controller we will monitor errors and characterize them if necessary. 
 * The API will return the information in a general format that contains all the information about the request and the requested result from the Call Of Duty 
 * official API.
 * 
 * We have methods here that are "protected" that mean they require verification and they need the 'setting.js' file to hold the data 
 * according to session from the verification from activision.com 'login' procedure,
 * Afterwards we have the "public" methods that do not need the session values from 'setting.js',
 * And in the end of the file we have help function's to make the code cleaner and re-useable, each section is seperated.
 * 
 * Note:
 * I do not reveal the file 'setting.js' because it contains personal information about my user,
 * The objects appear here at the beginning of the code [ACT_SSO_COOKIE, ACT_SSO_COOKIE_EXPIRY, ATKN] is what you need to extract 
 * from the session in order to use the code.
 ************************************************************************************************************************************************************************/

/* ================================================== Proteced methods [need session cookies!] ======================================================================================= */

exports.getPlayerLastGamesData = (req, res, next) => {
    /* create config object for axios */
    const platform = req.params.platform;
    const username = req.params.username;
    let config = configBuilder(platform, username, "lastGamesData");
    axios(config)
        .then((response) => {
            if (response.data.status === 'error') {
                /* set the currect error status code for our problem */
                const error = errorIdentifier(response);
                throw error;
            }
            console.log("Player Last Games Data Pull Succeeded!");
            res.status(200).json({ data: response.data });
        })
        .catch((error) => {
            if(!error) {
                next(error);
                return;
            }
            if (!error.statusCode) {
                /* unknown error! */ 
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getPlayerLifetimeData = (req, res, next) => {
    const platform = req.params.platform;
    const username = req.params.username;
    let config = configBuilder(platform, username, "lifetimeData");
    axios(config)
        .then((response) => {
            if (response.data.status === 'error') {
                const error = errorIdentifier(response);
                throw error;
            }
            console.log("Player Lifetime Data Pull Succeeded!");
            res.status(200).json({ data: response.data });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/* ================================================== Public methods [No session verification required] ============================================================================ */

exports.getGameData = (req, res, next) => {
    const gameId = req.params.gameId;
    let config = gameConfig(gameId);
    axios(config)
        .then((response) => {
            if (response.data.status === 'error') {
                throw error;
            }

            if(response.data.data.allPlayers.length === 0 ) {
                const error = new Error("invalid Game ID!");
                error.statusCode = 422;
                throw error;
            }

            console.log("Match Data Pull Succeeded!");
            res.status(200).json({ data: response.data });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/* ================================================== help methods ======================================================================================= */

const errorIdentifier = (response) => {
    let error;
    if (response.data.data.message === 'Not permitted: user not found') {
        error = new Error('Player search failed, entered data is incorrect.');
        error.statusCode = 422;
        return error;
    }
    if (response.data.data.message === 'Not permitted: not allowed') {
        error =  new Error('Player search failed, the account with private permission should be public.');
        error.statusCode = 404;
        return error;
    }
    if (response.data.data.message === 'Not permitted: not authenticated') {
        error = new Error('Player search failed, the cookie session details invalid/expires.');
        error.statusCode = 503;
        return error;
    }
}

const configBuilder = (platform, username, task) => {
    return {
        method: 'get',
        url: urlBuilder(platform, username, task),
        headers: {
            'Cookie': `ACT_SSO_COOKIE=${ACT_SSO_COOKIE}; ACT_SSO_COOKIE_EXPIRY=${ACT_SSO_COOKIE_EXPIRY}; atkn=${atkn};`
        }
    };
}

const buildBattleUserName = (battleName) => {
    splitRes = battleName.split('#');
    console.log(battleName);
    if(!splitRes[1]) {
        return splitRes[0] + "%23";
    }
    return splitRes[0] + "%23" + splitRes[1];
};

const urlBuilder = (platform, username, task) => {
    let fixedUsername = username;

    if(platform === 'battle') {  // because battle account contain '#' we need to encoded the username.
        fixedUsername = buildBattleUserName(username);
    }

    if (task === "lastGamesData") {
        return `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/${platform}/gamer/${fixedUsername}/matches/wz/start/0/end/0/details`;
    }
    if (task === "lifetimeData") {
        return `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${platform}/gamer/${fixedUsername}/profile/type/wz`;
    }
    throw new Error("invalid argument for task in 'urlBuilder' method!");
};

const gameConfig = (gameId) => {
    return {
        method: 'get',
        url: `https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${gameId}/it`,
        headers: {}
    };
};