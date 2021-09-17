const express = require('express');

const router = express.Router();

const extractController = require('../controllers/extract');

router.get("/lastGamesStats/:platform/:username", extractController.getLastGamesArrayAndSummary);
router.get("/generalStats/:platform/:username", extractController.getLifetimeAndWeeklyStats);
router.get("/allPlayers/:gameId", extractController.getAllPlayersFromGame);

module.exports = router;