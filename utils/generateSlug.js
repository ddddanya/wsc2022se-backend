const mysql = require('../helpers/mysql');

const generateSlug = async (title) => {
    // generate slug
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    // check if slug exists
    const exists = await mysql.call(`SELECT * FROM games WHERE slug = ?`, [slug]);
    // if exists, add number
    if (exists.length > 0) {
        return `${slug}-${exists.length}`;
    }

    return slug;
}

module.exports = {
    generateSlug
}