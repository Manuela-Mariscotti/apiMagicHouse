const Router = require('express');
const router = Router();

const eventsCtrl = require('../controller/events.controller');

router.post('/events', eventsCtrl.postEvent);
router.get('/events', eventsCtrl.getAll);

module.exports = router;