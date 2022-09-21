const Router = require("express");
const router = Router();
const hogarCtrl = require ("../controller/crear-hogar.controller");

router.post('/hogar', hogarCtrl.postNewHogar); //postNewHogar

router.put('/hogar', hogarCtrl.putJoinHogar);

module.exports = router;