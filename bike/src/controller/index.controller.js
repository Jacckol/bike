const passport = require('passport');

const indexCtl = {};

indexCtl.mostrarMensaje = async (req, res) => {
  res.json({ 
    mensaje: 'Bienvenido al API de Alquiler de Bicicletas',
    status: 'activo'
  });
};

indexCtl.registro = (req, res, next) => {
  passport.authenticate('local.usuarioSignup', (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Error interno', error: err.message });
    if (!user) return res.status(400).json({ success: false, message: info || 'Registro fallido' });

    req.logIn(user, err => {
      if (err) return res.status(500).json({ success: false, message: 'Error al iniciar sesión tras registro' });
      return res.status(201).json({ success: true, message: info || 'Registro exitoso', user });
    });
  })(req, res, next);
};

indexCtl.login = (req, res, next) => {
  passport.authenticate('local.usuarioLogin', (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Error interno', error: err.message });
    if (!user) return res.status(401).json({ success: false, message: info || 'Credenciales incorrectas' });

    req.logIn(user, err => {
      if (err) return res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
      return res.json({ success: true, message: info || 'Login exitoso', user });
    });
  })(req, res, next);
};

indexCtl.cerrarSesion = (req, res, next) => {
  req.logout(err => {
    if (err) return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    return res.json({ success: true, message: 'Sesión cerrada correctamente' });
  });
};

indexCtl.perfil = (req, res) => {
  res.json({
    success: true,
    message: 'Perfil del usuario',
    user: req.user
  });
};

module.exports = indexCtl;
