const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/connection.js");
const AuthRoute = require("./routes/auth.js");
const { verifyAccesstoken } = require("./helpers/jwtHelper.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", verifyAccesstoken, async (req, res, next) => {
  res.send({ message: "Hello Roshan Shaw" });
});

app.use("/auth", AuthRoute);

// Error Handling....
app.use(async (req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at PORT ${port}`);
});
