const mysql = require('../helpers/mysql');

const validateSignup = async (req, res, next) => {
    const errors = {}
    const { username, password } = req.body

if (!username) {
        errors.username = {
            message: 'required'
        }
    } else {
        if (username.length < 4) {
            errors.username = {
                message: 'must be at least 4 characters long'
            }
        }
        if (username.length > 60) {
            errors.username = {
                message: 'must be at most 60 characters long'
            }
        }
    }

    if (!password) {
        errors.password = {
            message: 'required'
        }
    } else {
        if (password.length < 8) {
            errors.password = {
                message: 'must be at least 8 characters long'
            }
        }
        if (password.length > Math.pow(2, 16)) {
            errors.password = {
                message: 'must be at most 60 characters long'
            }
        }
    }

    // check existing user
    const result = await mysql.call(`SELECT * FROM app_users WHERE username = ?`, [username]);

    if (result.length > 0) {
        errors.username = {
            message: 'username already exists'
        }
    }

    if (Object.keys(errors).length > 0) {
        res.json({
            status: 'invalid',
            message: 'Request body is not valid.',
            violations: errors
        })
    } else {
        next()
    }
}

module.exports = {
    validateSignup
};