const Router = require('express');
const router = Router();

const notificationsCtrl = require('../controller/notification.controller');

router.get('/nextEvent', notificationsCtrl.getNextEvent);
router.get('/pendingTasks', notificationsCtrl.getPendingTasks);

module.exports = router