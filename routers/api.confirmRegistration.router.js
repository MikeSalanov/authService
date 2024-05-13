const userService = require("../services/userService");

const router = require("express").Router();

router.post('/confirm-registration', async (req, res, next) => {
    try {
        const { email, password, confirmationCode } = req.body
        const userData = await userService.confirmRegistration(email, password, confirmationCode);

        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
