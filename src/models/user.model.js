const knex = require("../db/database");

const checkTable = async () => {
  try {
    const result = await knex.schema.hasTable("users");

    if (!result) {
      console.log("Table does not exist");
      return knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("name");
        table.string("email");
        table.string("account_number");
        table.biginteger("balance");
        table.string("password");
      });
    } else {
      console.log("Table exists");
    }
    console.log(result);
  } catch (error) {
    console.log(error.sqlMessage);
  }
};

module.exports = checkTable;

// knex.schema
//   .createTable("users", (table) => {
//     table.increments("id");
//     table.string("name");
//     table.integer("age");
//   })
//   .then(() => console.log("table created"))
//   .catch((err) => {
//     console.log(err.message);
//   })
//   .finally(() => {
//     knex.destroy();
//   });
