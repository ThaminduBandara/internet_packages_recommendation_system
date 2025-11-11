const express = require('express');
const router = express.Router();
const { createUser, loginUser} = require('./controllers/user');






router.post('/createuser', createUser);
router.post('/login', loginUser);


module.exports = router;