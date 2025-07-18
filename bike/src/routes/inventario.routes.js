const express = require('express');
const router = express.Router();
const ctl = require('../controller/inventario.controller');

router.post('/', ctl.crear);
router.get('/', ctl.listar);
router.get('/:id', ctl.obtener);
router.put('/:id', ctl.actualizar);
router.delete('/:id', ctl.eliminar);

module.exports = router;
