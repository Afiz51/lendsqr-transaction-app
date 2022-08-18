function isUser(req, res, next) {
  if (!req.user) return res.status(403).send("Access Denied");

  next();
}

module.exports = isUser;
