require("dotenv").config();

console.log(process.env.DB_USER);
const options = {
  client: "mysql2",
  connection: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
};

const knex = require("knex")(options);

module.exports = knex;
