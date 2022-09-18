const Router = require('express');
const router = Router();

const UserCtrl = require('../controller/login.controller');

router.post('/login', UserCtrl.login)

module.exports = router;