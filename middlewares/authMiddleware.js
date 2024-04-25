const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const mysql = require("../helpers/mysql");
dotenv.config();

const authMiddleware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        if (req.path.includes("/upload")) {
            return next()
        }
        if (!req.headers.authorization) {
            return res.status(401).json({ status: 'unauthenticated', message: "Missing token" })
        }

        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({ status: 'unauthenticated', message: "Missing token" })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const user = await mysql.call(`SELECT * FROM app_users WHERE id = ?`, [decodedData.id]);
        if (user.length === 0) {
            return res.status(401).json({ status: 'unauthenticated', message: "Invalid token" })
        }
        if (user[0].blocked == "true") {
            return res.status(403).json({ status: 'blocked', message: "User blocked", reason: "You have been blocked by an administrator" })
        }
        req.user = decodedData;
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: 'unauthenticated', message: "Invalid token" })
    }
}

module.exports = authMiddleware;