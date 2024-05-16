require('dotenv').config();
const express = require('express');

const serverConfig = require('./serverConfig/serverConfig');
const app = express();
const PORT = process.env.PORT || 4001;

const errorMiddleware = require('./middlewares/error-middleware');
const adminMiddleware = require('./middlewares/admin-middleware');

const registerRouter = require('./routers/api.signup.router');
const loginRouter = require('./routers/api.login.router');
const logOutRouter = require('./routers/api.logout.router');
const refreshRouter = require('./routers/api.refresh.router');
const validateAccessTokenRouter = require('./routers/api.tokenValidate.router');

const confirmRegistrationRouter = require('./routers/api.confirmRegistration.router');

serverConfig(app);

app.use('/auth-service',
    registerRouter,
    loginRouter,
    logOutRouter,
    refreshRouter,
    validateAccessTokenRouter,
    confirmRegistrationRouter
);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server is started on PORT: ${PORT}`));
