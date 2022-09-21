const Router = require('express');
const router = Router();

const userdataCtrl = require('../controller/userdata.controller');

router.get('/getUsersByHome', userdataCtrl.getUsersByHome);
router.get('/userById', userdataCtrl.getUserByid)


module.exports = router