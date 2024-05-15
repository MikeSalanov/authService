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
      origin: 'http://localhost:5173',
    })
  );
};

module.exports = serverConfig;
