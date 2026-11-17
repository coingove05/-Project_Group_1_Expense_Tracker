require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
});

//connenction test in backend
pool.connect()
    .then(client => {
        console.log('Sql Connected');
        client.release();
    })
    .catch(err => {
        console.error('Sql Failed to Connect:', err.message);
    });

module.exports = pool;
