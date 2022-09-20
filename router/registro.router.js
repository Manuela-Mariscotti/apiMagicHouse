const {Router} = require("express");
const router = Router();
const registroCtrl = require ("../controller/registro.controller");

router.post("/registro",registroCtrl.postUser);

module.exports = router;