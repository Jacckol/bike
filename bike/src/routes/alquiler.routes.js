const express = require('express');
const router = express.Router();
const alquilerCtl = require('../controller/alquiler.controller');

router.post('/', alquilerCtl.crear);
router.get('/', alquilerCtl.listar);
router.get('/:id', alquilerCtl.obtener);
router.put('/:id', alquilerCtl.actualizar);
router.delete('/:id', alquilerCtl.eliminar);

module.exports = router;
