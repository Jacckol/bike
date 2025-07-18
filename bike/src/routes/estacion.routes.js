const express = require('express');
const router = express.Router();
const estacionCtl = require('../controller/estacion.controller');

router.post('/', estacionCtl.crear);
router.get('/', estacionCtl.listar);
router.get('/:id', estacionCtl.obtener);
router.put('/:id', estacionCtl.actualizar);
router.delete('/:id', estacionCtl.eliminar);

module.exports = router;
