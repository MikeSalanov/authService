require("dotenv").config();
const express = require("express");

const serverConfig = require("./serverConfig/serverConfig");
const app = express();
const PORT = process.env.PORT || 5000;

const registerRouter = require("./routers/api.auth.router");
const mailRouter = require("./routers/api.mail.router");

serverConfig(app);

app.use("/api", registerRouter, mailRouter);

app.listen(PORT, () => console.log(`Server is started on PORT: ${PORT}`));
