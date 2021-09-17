const express = require('express');

const router = express.Router();

const pullController = require('../controllers/pull');

router.get('/lastGamesData/:platform/:username', pullController.getPlayerLastGamesData);
router.get('/lifetimeData/:platform/:username', pullController.getPlayerLifetimeData);
router.get('/gameStats/:gameId', pullController.getGameData);

module.exports = router;