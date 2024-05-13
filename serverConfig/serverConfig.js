const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const serverConfig = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors()
  );
};

module.exports = serverConfig;
