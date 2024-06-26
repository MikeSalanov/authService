const adminService = require('../services/adminService');

const router = require('express').Router();
const adminMiddleware = require('../middlewares/admin-middleware');

router.get('/users',adminMiddleware, async (req, res) => {
  try {
    const usersData = await adminService.getUsers();
    return res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/users',adminMiddleware, async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const userData = await adminService.delUser(id);
    return res.json(userData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
