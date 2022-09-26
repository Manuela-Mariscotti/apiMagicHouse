const Router = require ("express");
const router = Router();
const listaCompraCtrl = require("../controller/lista-compra.controller")

router.get('/compra',listaCompraCtrl.getListaCompraByHome);

router.post('/compra',listaCompraCtrl.postListaCompra);

module.exports = router;