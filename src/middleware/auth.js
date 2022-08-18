const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  //   console.log(JSON.stringify(req.headers));
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ msg: "Access denied. No token provided" });

  try {
    //const decoded = jwt.decode(token, process.env.JSON_PRIVATE_KEY);

    next();
  } catch (error) {
    if (error) res.status(400).send("Invalid token");
  }
}

module.exports = auth;
