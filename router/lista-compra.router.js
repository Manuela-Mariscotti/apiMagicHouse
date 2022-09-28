const Router = require ("express");
const router = Router();
const listaCompraCtrl = require("../controller/lista-compra.controller")

router.get('/compra',listaCompraCtrl.getListaCompraByHome);

router.post('/compra',listaCompraCtrl.postListaCompra);

router.delete('/compra',listaCompraCtrl.deleteByIdProduct)

module.exports = router;