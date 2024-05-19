const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const serverConfig = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:5173', 'http://5.35.80.205:8080', 'http://stable-exchange.top'],
    })
  );
};

module.exports = serverConfig;
