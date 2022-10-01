const Router = require("express");
const router = Router();
const hogarCtrl = require ("../controller/hogar.controller");

router.post('/hogar', hogarCtrl.postNewHogar);

router.put('/hogar', hogarCtrl.putJoinHogar);

router.get('/hogar',hogarCtrl.getHogarById);

module.exports = router;