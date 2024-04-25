const {generateToken} = require("../jwt/generate");
const mysql = require("../helpers/mysql");

const signup = async (req, res) => {
    const {username, password} = req.body;
    const query = `INSERT INTO app_users (username, password) VALUES (?, ?)`;
    const result = await mysql.call(query, [username, password]);

    const token = generateToken(result.insertId);
    res.status(201).json({
        status: 'success',
        token
    });
}

const signin = async (req, res) => {
    const {username, password} = req.body;
    const query = `SELECT * FROM app_users WHERE username = ? AND password = ?`;
    const result = await mysql.call(query, [username, password]);

    if (result.length === 0) {
        res.status(401).json({
            status: 'invalid',
            message: 'Wrong username or password'
        });
    } else {
        const token = generateToken(result[0].id);
        res.json({
            status: 'success',
            token
        });
    }
}

const signout = async (req, res) => {
    res.json({
        status: 'success'
    });
}

module.exports = {
    signup,
    signin,
    signout
}