const fs = require('fs');
const mysql = require('../helpers/mysql')
const {generateSlug} = require("../utils/generateSlug");

const getGames = async (req, res) => {
    // get query params
    let {
        page,
        size,
        sortBy,
        sortDir
    } = req.query

    // set default values
    if (!page) {
        page = 0
    }
    if (!size) {
        size = 10
    }

    // calculate offset
    const offset = page * size

    // set default values
    if (!sortBy) {
        sortBy = 'title'
    }
    if (!sortDir) {
        sortDir = 'asc'
    }

    // mysql query
    const query = `SELECT * FROM games LIMIT ${size} OFFSET ${offset}`
    const result = await mysql.call(query)

    // get versions, author and scores
    for (let i in result) {
        const versions = await mysql.call(`SELECT * FROM games_versions WHERE gameId = ?`, [result[i].id])
        result[i].versions = versions

        const author = await mysql.call(`SELECT * FROM app_users WHERE id = ?`, [result[i].ownerId])
        result[i].author = author[0]

        const scores = await mysql.call(`SELECT * FROM games_scores WHERE gameId = ?`, [result[i].id])
        result[i].scores = scores

        // calculate total score
        let totalScore = 0

        for (let j in scores) {
            totalScore += scores[j].score
        }

        result[i].totalScore = totalScore

        try {
            // check thumbnail exist in folder
            const thumbnail = `http://localhost:3000/games/${result[i].slug}/v${result[i].versions[result[i].versions.length - 1].versionId}/thumbnail.png`
            const thumbnailPath = `./games/${result[i].slug}/v${result[i].versions[result[i].versions.length - 1].versionId}/thumbnail.png`
            if (fs.existsSync(thumbnailPath)) {
                result[i].thumbnail = thumbnail
            }
        } catch (e) {
        }
    }

    // sorting
    try {
        if (sortBy === 'title') {
            result.sort((a, b) => {
                if (sortDir === 'asc') {
                    return a.title.localeCompare(b.title)
                } else {
                    return b.title.localeCompare(a.title)
                }
            })
        }

        if (sortBy === 'popular') {
            result.sort((a, b) => {
                if (sortDir === 'asc') {
                    return a.totalScore - b.totalScore
                } else {
                    return b.totalScore - a.totalScore
                }
            })
        }

        if (sortBy === 'uploaddate') {
            result.sort((a, b) => {
                if (sortDir === 'asc') {
                    return new Date(a.versions[a.versions.length - 1].timestamp) - new Date(b.versions[b.versions.length - 1].timestamp)
                } else {
                    return new Date(b.versions[b.versions.length - 1].timestamp) - new Date(a.versions[a.versions.length - 1].timestamp)
                }
            })
        }
    } catch (e) {
    }

    // get total elements
    const total = await mysql.call(`SELECT COUNT(*) as total FROM games`)

    // return response
    res.json({
        page: page,
        size: size,
        totalElements: total[0].total,
        content: result
            // filtering only with versions
            .filter(game => game.versions.length > 0)
            // mapping to new object
            .map(game => {
                return {
                    id: game.id,
                    title: game.title,
                    description: game.description,
                    slug: game.slug,
                    thumbnail: game.thumbnail,
                    author: game.author.username,
                    uploadTimestamp: game.versions[game.versions.length - 1].timestamp,
                    scoreCount: game.totalScore
                }
            })
    })
}

const createGame = async (req, res) => {
    // get title and description
    const { title, description } = req.body
    // mysql query
    const query = `INSERT INTO games (title, description, slug, ownerId) VALUES (?, ?, ?, ?)`
    const slug = await generateSlug(title)
    // call mysql
    const result = await mysql.call(query, [title, description, slug, req.user.id])

    res.json({
        status: 'success',
        slug
    })
}

const getGame = async (req, res) => {
    // get slug
    const { slug } = req.params
    // mysql query
    const game = await mysql.call(`SELECT * FROM games WHERE slug = ?`, [slug])

    // check if game exists
    if (game.length === 0) {
        return res.status(404).json({ status: 'notfound', message: 'game not found' })
    }

    // get versions, author and scores
    const versions = await mysql.call(`SELECT * FROM games_versions WHERE gameId = ?`, [game[0].id])
    game[0].versions = versions

    const author = await mysql.call(`SELECT * FROM app_users WHERE id = ?`, [game[0].ownerId])
    game[0].author = author[0]

    const scores = await mysql.call(`SELECT * FROM games_scores WHERE gameId = ?`, [game[0].id])
    game[0].scores = scores

    // calculate total score
    let totalScore = 0

    for (let j in scores) {
        totalScore += scores[j].score
    }

    game[0].totalScore = totalScore

    // check thumbnail exist in folder
    try {
        const thumbnail = `http://localhost:3000/games/${game[0].slug}/v${game[0].versions[game[0].versions.length - 1].versionId}/thumbnail.png`
        const thumbnailPath = `./games/${game[0].slug}/v${game[0].versions[game[0].versions.length - 1].versionId}/thumbnail.png`
        if (fs.existsSync(thumbnailPath)) {
            game[0].thumbnail = thumbnail
        }
    } catch (e) {
    }

    res.json({
        id: game[0].id,
        title: game[0].title,
        description: game[0].description,
        slug: game[0].slug,
        thumbnail: game[0].thumbnail,
        author: game[0].author.username,
        uploadTimestamp: game[0].versions[game[0].versions.length - 1].timestamp,
        scoreCount: game[0].totalScore,
        gamePath: `http://localhost:3000/games/${game[0].slug}/v${game[0].versions[game[0].versions.length - 1].versionId}`
    })
}

const editGame = async (req, res) => {
    // get slug
    const { slug } = req.params
    // get title and description
    let { title, description } = req.body

    // check if user is owner
    const game = await mysql.call(`SELECT * FROM games WHERE slug = ?`, [slug])
    if (game[0].ownerId !== req.user.id) {
        return res.status(403).json({ status: 'forbidden', message: 'you are not the game author' })
    }

    // set default values
    if (!title) {
        title = game[0].title
    }
    if (!description) {
        description = game[0].description
    }

    // mysql query
    const query = `UPDATE games SET title = ?, description = ? WHERE slug = ?`
    // call mysql
    mysql.call(query, [title, description, slug])

    res.json({
        status: 'success'
    })
}

const deleteGame = async (req, res) => {
    // get slug
    const { slug } = req.params

    // check if user is owner
    const game = await mysql.call(`SELECT * FROM games WHERE slug = ?`, [slug])
    if (game[0].ownerId !== req.user.id) {
        return res.status(403).json({ status: 'forbidden', message: 'you are not the game author' })
    }

    // mysql query
    const query = `DELETE FROM games WHERE slug = ?`
    // call mysql
    mysql.call(query, [slug])

    res.json({
        status: 'success'
    })
}

module.exports = {
    getGames,
    createGame,
    getGame,
    editGame,
    deleteGame
}