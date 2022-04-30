const mysql2 = require("mysql2");

module.exports = mysql2.createPool({
  port: 3306,
  user: "root",
  password: "fourleaf0309",
  host: "127.0.0.1",
  database: "pos",
});
