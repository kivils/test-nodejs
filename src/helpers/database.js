const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root-user4',
  database: 'test-nodejs'
});

module.exports = pool.promise();
