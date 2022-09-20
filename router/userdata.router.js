const Router = require('express');
const router = Router();

const userdataCtrl = require('../controller/userdata.controller');

router.get('/getUsersByHome', userdataCtrl.getUsersByHome);

module.exports = router