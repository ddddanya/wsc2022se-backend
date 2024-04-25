var express = require('express');

// validators
const {validateSignup} = require("../validators/signup");

// controllers
const authController = require("../controllers/authController");
const gamesController = require("../controllers/gamesController");
const usersController = require("../controllers/usersController");

// middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const {validateGameCreation} = require("../validators/creatingGame");

var router = express.Router();

// POST /api/v1/auth/signup
router.post('/auth/signup', validateSignup, authController.signup);

// POST /api/v1/auth/signin
router.post('/auth/signin', authController.signin);

// POST /api/v1/auth/signout
router.post('/auth/signout', authController.signout);

// GET /api/v1/games
router.get('/games', gamesController.getGames);

// POST /api/v1/games/:slug/upload
router.post('/games/:slug/upload', gamesController.uploadGame)

// GET /api/v1/games/:slug
router.get('/games/:slug', gamesController.getGame);

// middleware for authentication
router.use(authMiddleware)

// POST /api/v1/games
router.post('/games', validateGameCreation, gamesController.createGame);

// PUT /api/v1/games/:slug
router.put('/games/:slug', gamesController.editGame);

// DELETE /api/v1/games/:slug
router.delete('/games/:slug', gamesController.deleteGame);

// GET /api/v1/users/:username
router.get('/users/:username', usersController.getUser);

module.exports = router;
