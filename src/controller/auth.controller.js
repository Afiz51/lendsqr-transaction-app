require("dotenv").config();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const knex = require("../db/database");

const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const [user] = await knex
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (!user) return res.status(400).json({ msg: "Invalid email or password" });
  try {
    const validPassword = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      { _id: user.email, accountNum: user.account_number },
      process.env.JSON_PRIVATE_KEY
    );

    if (validPassword) res.header("x-auth-token", token).send(token);
    else return res.status(400).json({ msg: "Invalid email or password" });

    res.header("x-auth-token", token).send(token);
    console.log("token", token);
  } catch (error) {
    if (error) return res.status;
  }
};

function validate(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(225).required(),
  });

  return schema.validate(obj);
}

module.exports = {
  login,
};
