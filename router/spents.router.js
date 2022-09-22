const Router = require('express');
const router = Router();

const spentsCtrl = require('../controller/spents.controller');

router.post('/newSpent', spentsCtrl.postSpent)
router.get('/getHomeSpents', spentsCtrl.getSpentsByHome)
router.get('/divide', spentsCtrl.divide)
router.get('/isTransactionUpdated', spentsCtrl.isTransactionUpdated)
router.get('/transactions', spentsCtrl.getTransactionsFromDB)

module.exports = router;