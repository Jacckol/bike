const express = require('express');
const router = express.Router();
const bicicletaCtl = require('../controller/bicicleta.controller');

router.post('/', bicicletaCtl.crear);
router.get('/', bicicletaCtl.listar);
router.get('/:id', bicicletaCtl.obtener);
router.put('/:id', bicicletaCtl.actualizar);
router.delete('/:id', bicicletaCtl.eliminar);

module.exports = router;
