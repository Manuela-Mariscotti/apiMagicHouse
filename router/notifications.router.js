const Router = require('express');
const router = Router();

const notificationsCtrl = require('../controller/notification.controller');

router.get('/notifications', notificationsCtrl.getNotifications);

module.exports = router