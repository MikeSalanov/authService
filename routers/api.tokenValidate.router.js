const router = require('express').Router();
const { validateAccessToken } = require("../services/tokenService");

router.get('/token/validate', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.status(400).json({ message: 'Authorization header not found' });
    const verifyTokenData = validateAccessToken(req.headers.authorization.split(' ')[1]);
    console.log(verifyTokenData);
    if (!verifyTokenData) return res.status(400).json({ isValid: false });
    return res.status(200).json({ isValid: true });
  } catch (err) {
    console.log('Token validate error:', err);
    return res.status(500).json({ message: 'Error' })
  }
});

module.exports = router;
