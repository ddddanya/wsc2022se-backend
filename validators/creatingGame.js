const mysql = require('../helpers/mysql');

const validateGameCreation = async (req, res, next) => {
    const errors = {}
    const {title, description} = req.body

    if (!title) {
        errors.title = {
            message: 'required'
        }
    } else {
        if (title.length < 3) {
            errors.title = {
                message: 'must be at least 3 characters long'
            }
        }
        if (title.length > 60) {
            errors.title = {
                message: 'must be at most 60 characters long'
            }
        }
    }

    if (!description) {
        errors.description = {
            message: 'required'
        }
    } else {
        if (description.length < 0) {
            errors.description = {
                message: 'must be at least 0 characters long'
            }
        }
        if (description.length > 200) {
            errors.description = {
                message: 'must be at most 200 characters long'
            }
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
    validateGameCreation
};