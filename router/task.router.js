const Router = require ("express");
const router = Router();
const taskCtrl = require ("../controller/task.controller");

router.get('/task', taskCtrl.getTasks);

router.get('/taskbyhome',taskCtrl.getTaskByHome);

router.post('/task', taskCtrl.postNewTask);

router.put('/task', taskCtrl.doTask);

router.delete('/task',taskCtrl.deleteTask)

module.exports = router;