const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
<<<<<<< HEAD
  client_encoding: 'UTF8' // Configura o encoding
=======

>>>>>>> a242227578269342ab000b7319a8fc6e9a5d40ef
});

module.exports = pool;