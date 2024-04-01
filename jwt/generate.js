const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id) => {
    const payload = {
        id
    };
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
    generateToken
};