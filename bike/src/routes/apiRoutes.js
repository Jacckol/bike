const express = require('express');
const router = express.Router();

// Importar cada grupo de rutas
const bicicletaRoutes = require('./bicicleta.routes');
const inventarioRoutes = require('./inventario.routes');
const estacionRoutes = require('./estacion.routes');
const alquilerRoutes = require('./alquiler.routes');
// const authRoutes = require('./auth.routes'); // Si decides activarlo

// Asociar rutas con sus endpoints base
router.use('/bicicletas', bicicletaRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/estaciones', estacionRoutes);
router.use('/alquiler', alquilerRoutes);
// router.use('/auth', authRoutes);

module.exports = router;
