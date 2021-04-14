const mysql = require ("mysql")

// Connect db
const db = mysql.createConnection ({
    user: "root",
    password: "admin10",
    database: "authentic_system",
    port: "3306"
})

module.exports = db