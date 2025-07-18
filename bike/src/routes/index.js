const express = require("express");
const router = express.Router();
const indexCtl = require('../controller/index.controller');
const { isLoggedIn } = require('../lib/auth');

// Rutas públicas
router.get('/', indexCtl.mostrarMensaje);

// Rutas de autenticación
router.post('/login', indexCtl.login);
router.post('/registro', indexCtl.registro);
router.get('/logout', indexCtl.cerrarSesion);

// Ruta protegida
router.get('/perfil', isLoggedIn, indexCtl.perfil);

module.exports = router;
