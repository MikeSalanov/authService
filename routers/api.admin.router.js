const adminService = require('../services/adminService');

const router = require('express').Router();

router.get('/users', async (req, res) => {
  try {
    const usersData = await adminService.getUsers();
    return res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
