require("dotenv").config();
const knex = require("../db/database");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const checkTable = require("../models/user.model");

checkTable();

const createAccount = async (req, res) => {
  const { name, email, balance, password } = req.body;

  try {
    const [isEmail] = await checkEmail(email);

    if (isEmail) return res.status(400).json({ msg: "Email already in use" });
  } catch (error) {
    if (error) console.log(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dataObj = {
    name,
    email,
    account_number: accountNumberGenerator(),
    balance: balance ? balance : 0,
    password: hashedPassword,
  };

  knex("users")
    .insert(dataObj)
    .then(() => {
      res.json({ msg: dataObj });
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
};

const fundAccount = async (req, res) => {
  const { accountNumber, amount } = req.body;

  try {
    await knex
      .from("users")
      .select("*")
      .where("account_number", "=", accountNumber)
      .increment("balance", amount);
    res.json({ msg: "account funded" });
  } catch (error) {
    if (error) res.send(error.message);
  }
};

const transfer = async (req, res) => {
  const { senderAccount, recieverAccount, amount } = req.body;
  const token = req.header("x-auth-token");

  const decoded = jwt.decode(token, process.env.JSON_PRIVATE_KEY);
  const [sender] = await getAccountDetails(senderAccount);

  if (sender.account_number !== decoded.accountNum)
    return res.status(403).send("Please login to make transactions");
  console.log(decoded);
  console.log(sender);
  const [reciever] = await getAccountDetails(recieverAccount);
  if (sender && sender.balance > amount) {
    transaction(senderAccount, recieverAccount, amount);
    res.json({ msg: "Transfer successful" });
  } else {
    res.json({ msg: "Transfer failed. Insufficient funds" });
  }
  console.log(sender.balance);
  console.log(reciever.balance);
};

const withdrawFunds = async (req, res) => {
  const { accountNumber, amount } = req.body;
  const [user] = await getAccountDetails(accountNumber);
  if (user && user.balance > amount) {
    withdraw(accountNumber, amount);
    res.json({ msg: "Transaction successful. Please take your cash" });
  } else if (!user) return res.json({ msg: "Invalid account number" });
  else return res.json({ msg: "Insufficient funds" });
};
//helper functions

async function checkEmail(email) {
  return await knex.from("users").select("email").where("email", "=", email);
}
async function getAccountDetails(accountNumber) {
  return await knex
    .from("users")
    .select("*")
    .where("account_number", "=", accountNumber);
}

async function withdraw(accountNumber, amount) {
  await knex("users")
    .where("account_number", "=", accountNumber)
    .decrement("balance", amount);

  return "Success";
}

async function transaction(senderAccount, recieverAccount, amount) {
  try {
    await knex.transaction((tranx) => {
      knex("users")
        .transacting(tranx)
        .where("account_number", "=", senderAccount)
        .decrement("balance", amount)
        .then(tranx.commit)
        .catch(() => {
          tranx.rollback();
        });
    });
    await knex.transaction((tranx) => {
      knex("users")
        .transacting(tranx)
        .where("account_number", "=", recieverAccount)
        .increment("balance", amount)
        .then(tranx.commit)
        .catch(() => {
          tranx.rollback();
        });
    });
  } catch (error) {
    if (error) res.send(error.message);
  }
  // await knex("users")
  //   .where("account_number", "=", senderAccount)
  //   .decrement("balance", amount);

  // await knex("users")
  //   .where("account_number", "=", recieverAccount)
  //   .increment("balance", amount);

  return "transaction successful";
}

function validate(obj) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    accountNumber: Joi.number().min(11).max(11),
    balance: Joi.number(),
    password: Joi.string().min(3).max(225).required(),
  });

  return schema.validate(obj);
}

function accountNumberGenerator() {
  return Math.floor(10000000000 + Math.random() * 90000000000);
}

module.exports = {
  createAccount,
  fundAccount,
  transfer,
  withdrawFunds,
};
