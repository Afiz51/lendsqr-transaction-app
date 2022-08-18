const auth = require("../middleware/auth");
const {
  createAccount,
  fundAccount,
  transfer,
  withdrawFunds,
} = require("../controller/user.controller");
const router = require("express").Router();

router.post("/create", createAccount);
router.post("/fund-account", fundAccount);
router.post("/transfer", auth, transfer);
router.post("/withdraw", withdrawFunds);

module.exports = router;
