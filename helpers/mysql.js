const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 1000
});

const call = async (sql, params) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(sql, params);
        return rows;
    } catch (e) {
        throw e;
    } finally {
        conn.release();
    }
}

module.exports = {
    call
}