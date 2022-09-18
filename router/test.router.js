const Router = require('express');
const router = Router();
const testCtrl = require('../controller/test.controller');

router.get('/', testCtrl.test);

module.exports = router;