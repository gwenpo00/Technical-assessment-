const mysql = require('mysql2');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mooitsmeemers123",
    database: "usermanagement",
  })
  .promise();

  module.exports = connection;