var express = require('express');
var fs = require('fs');
var mysql = require('../helpers/mysql');
var router = express.Router();

// GET /admin, if there is no cookie token, render login page, otherwise redirect to /admin/dashboard
router.get('/', function (req, res, next) {
    if (!req.cookies.token) {
        res.render('login');
    } else {
        res.redirect('/admin/dashboard');
    }
});

// GET /admin/login, render login page
router.get('/login', function (req, res, next) {
    res.render('login');
})

// POST /admin/login, if username and password match, set cookie token and redirect to /admin/dashboard, otherwise redirect to /admin/login
router.post('/login', async function (req, res, next) {
    // data from body
    const {username, password} = req.body;

    // query to check if username and password match
    const query = `SELECT * FROM admin_users WHERE username = ? AND password = ?`;
    const result = await mysql.call(query, [username, password]);

    // if username and password match
    if (result.length > 0) {
        // set cookie token
        res.cookie('token', `${username}:${password}`);
        // redirect to /admin/dashboard
        res.redirect('/admin/dashboard');
    }
    // if username and password do not match
    else {
        // redirect to /admin/login
        res.redirect('/admin/login');
    }
})

// middleware to check if there is a cookie token
router.use(async function (req, res, next) {
    // if there is a cookie token
    if (req.cookies.token) {
        // get username and password from cookie token
        const [username, password] = req.cookies.token.split(':');
        // query to check if username and password match
        const user = await mysql.call(`SELECT * FROM admin_users WHERE username = ? AND password = ?`, [username, password]);
        // if username and password match
        if (user.length > 0) {
            // continue to the next middleware
            next();
        }
        // if username and password do not match
        else {
            // redirect to /admin/login
            res.redirect('/admin/login');
        }
    } else {
        // redirect to /admin/login
        res.redirect('/admin/login');
    }
})

// GET /admin/dashboard, render dashboard page
router.get('/dashboard', async function (req, res, next) {
    // query to get all admin users
    const allAdminUsers = await mysql.call(`SELECT * FROM admin_users`);

    // render dashboard page
    res.render('index', {allAdminUsers});
})

// GET /admin/logout, clear cookie token and redirect to /admin/login
router.get('/logout', function (req, res, next) {
    // clear cookie token
    res.clearCookie('token');

    // redirect to /admin/login
    res.redirect('/admin/login');
})

// GET /admin/users, render users page
router.get('/users', async function (req, res, next) {
    // query to get all users
    const allUsers = await mysql.call(`SELECT * FROM app_users`);

    // render users page
    res.render('users', {allUsers});
})

// GET /admin/users/:id, render user page
router.get('/users/:username', async function (req, res, next) {
    // get id from params
    const {username} = req.params;

    // query to get user by id
    const user = await mysql.call(`SELECT * FROM app_users WHERE username = ?`, [username]);

    // if user not found
    if (user.length === 0) {
        // redirect to /admin/users
        res.redirect('/admin/users');
    }

    // if user blocked
    if (user[0].blocked === 'true') {
        // redirect to /admin/users
        res.render("404")
    }

    // render user page
    res.render('user', {user: user[0]});
})

// POST /admin/users/:id/block, block user by id
router.post('/users/:username/block', async function (req, res, next) {
    // get id from params
    const {username} = req.params;

    // query to block user by id
    const result = await mysql.call(`UPDATE app_users SET blocked = 'true' WHERE username = ?`, [username]);

    // redirect to /admin/users/:id
    res.redirect(`/admin/users`);
})

// GET /admin/games, render games page
router.get('/games', async function (req, res, next) {
    // query to get all games
    const allGames = await mysql.call(`SELECT * FROM games`);

    for (let i in allGames) {
        const versions = await mysql.call(`SELECT * FROM games_versions WHERE gameId = ?`, [allGames[i].id])
        allGames[i].versions = versions

        const author = await mysql.call(`SELECT * FROM app_users WHERE id = ?`, [allGames[i].ownerId])
        allGames[i].author = author[0]

        const scores = await mysql.call(`SELECT * FROM games_scores WHERE gameId = ?`, [allGames[i].id])
        allGames[i].scores = scores

        let totalScore = 0

        for (let j in scores) {
            totalScore += scores[j].score
        }

        allGames[i].totalScore = totalScore

        try {
            // check thumbnail exist in folder
            const thumbnail = `http://localhost:3000/games/${allGames[i].slug}/v${allGames[i].versions[allGames[i].versions.length - 1].versionId}/thumbnail.png`
            const thumbnailPath = `./games/${allGames[i].slug}/v${allGames[i].versions[allGames[i].versions.length - 1].versionId}/thumbnail.png`
            if (fs.existsSync(thumbnailPath)) {
                allGames[i].thumbnail = thumbnail
            }
        } catch (e) {
        }
    }

    console.log(allGames[0])
    // render games page
    res.render('games', {allGames});
})

module.exports = router;
