const { Pool } = require("pg");
const { promisify } = require("util");
const dotenv = require('dotenv');

dotenv.config();

const { POSTGRESHOST, POSTGRESUSER, POSTGRESPASSWORD, POSTGRESDATABASE, POSTGRESPORT } = require("../config/keys");

const pool = new Pool({
    user: POSTGRESUSER,
    password: POSTGRESPASSWORD,
    host: POSTGRESHOST,
    port: POSTGRESPORT,
    database: POSTGRESDATABASE
});

pool.on('connect', () => {
    console.log('Conexión directa a PostgreSQL establecida');
});

pool.on('error', (err) => {
    console.error('Error inesperado en la conexión a PostgreSQL:', err);
    process.exit(-1);
});


pool.query = promisify(pool.query);

module.exports = pool;