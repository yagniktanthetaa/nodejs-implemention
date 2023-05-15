require("./src/db/connection");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mung = require("express-mung");

// Router
const usersRouter = require("./src/router/user-router");

// Create Server
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: false }));

// Passport middleware
const passport = require("passport");
app.use(passport.initialize());
require("./src/authentication/passport");

// routes for encode and decode data (for development purpose only)
const userControllers = require("./src/controller/user-controller");
const {
  decodeReqData,
  encodeResData,
} = require("./src/public/partials/cryptoJS");
app.post("/encodeData", userControllers.encodeReqData);
app.post("/decodeData", userControllers.decodeResData);

//decode the request body for every request
app.use(decodeReqData);

//encode the response body for every request
app.use(mung.json(encodeResData));

// Use Router
app.use(usersRouter);

// Default Route
app.use("*", (req, res) => {
  res.writeHead(200);
  fs.readFile("./src/pages/index.html", (error, contents) => {
    res.write(contents);
    res.end();
  });
});

// server port define
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server listening on port", port);
});
