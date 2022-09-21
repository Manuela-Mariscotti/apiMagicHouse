const Router = require('express');
const router = Router();

const spentsCtrl = require('../controller/spents.controller');

router.post('/newSpent', spentsCtrl.postSpent)
router.get('/getHomeSpents', spentsCtrl.getSpentsByHome)
router.get('/divide', spentsCtrl.divide)

module.exports = router;