const Router = require('express');
const router = Router();
const budgetCtrl = require('../controller/budget.controller');

router.get('/budget', budgetCtrl.getBudgetPercent);
router.post('/budget', budgetCtrl.postBudget)

module.exports = router