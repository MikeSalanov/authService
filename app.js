require("dotenv").config();
const express = require("express");

const serverConfig = require("./serverConfig/serverConfig");
const app = express();
const PORT = process.env.PORT || 5000;

const errorMiddleware = require("./middlewares/error-middleware");

const registerRouter = require("./routers/api.auth.router");
const loginRouter = require("./routers/api.login.router");
const logOutRouter = require("./routers/api.logout.router");
const refreshRouter = require("./routers/api.refresh.router");

serverConfig(app);

app.use("/api", registerRouter, loginRouter, logOutRouter, refreshRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server is started on PORT: ${PORT}`));
