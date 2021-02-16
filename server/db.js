//connects us to the db
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "dokolas",
  password: "@Micro52",
  host: "localhost",
  port: 5432,
  database: "jwttutorial",
});

module.exports = pool;
