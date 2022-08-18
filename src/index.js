const express = require("express");

//import routes
const userRoute = require("./routes/user.routes");
const authRoute = require("./routes/auth.routes");

const app = express();

app.use(express.json());

//use routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(7000, () => {
  console.log("listening on port 5000...");
});
