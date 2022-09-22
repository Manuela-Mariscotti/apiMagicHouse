const Router = require ("express");
const router = Router();
const taskCtrl = require ("../controller/task.controller");

router.get('/task', taskCtrl.getTasks)

router.post('/task', taskCtrl.postNewTask);

module.exports = router;