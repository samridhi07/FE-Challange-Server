const sql = require('mssql/msnodesqlv8');

// Database configuration with windows authentication
const dbConfig = {
  server: 'CYG630\\',
  database: 'Result',

  options: {
    trustedConnection: true,
  },
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

module.exports = {
  pool,
  poolConnect,
};
