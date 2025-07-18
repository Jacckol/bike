const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { cifrarDatos, descifrarDatos, hashPassword, comparePassword } = require('./encrypDates');
const { Usuario, Cliente } = require('../database/dataBase.orm');  
const { usuarioModel, clienteModel } = require('../database/dataBaseMongose');
   

//registro
passport.use(
  'local.usuarioSignup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const { cedula, nombreCompleto, rol, direccion, telefono, email } = req.body;

        // Verificar si ya existe usuario con ese username
        const existe = await Usuario.findOne({ where: { username } });
        if (existe) return done(null, false, 'El nombre de usuario ya está en uso');

        const hashedPassword = await hashPassword(password);
        let idCliente = null;

        // Crear usuario en PostgreSQL
        const nuevoUsuario = await Usuario.create({
          cedula: cifrarDatos(cedula),
          nombreCompleto: cifrarDatos(nombreCompleto),
          username,
          password: hashedPassword,
          rol,
          idCliente: null,
        });

        if (rol === 'cliente') {
          // Crear cliente SQL
          const clienteNuevo = await Cliente.create({
            cedulaCliente: cifrarDatos(cedula),
            nombreCompleto: cifrarDatos(nombreCompleto),
          });

          idCliente = clienteNuevo.idCliente;
          await nuevoUsuario.update({ idCliente });

          // Crear usuario en Mongo
          await usuarioModel.create({
            direccion,
            telefono,
            email,
            idUsuarioSql: nuevoUsuario.idUsuario.toString(),
            rol,
          });

          // ✅ Crear cliente en Mongo
          await clienteModel.create({
            direccion,
            telefono,
            email,
            idClienteSql: idCliente.toString(),
            historialAlquileres: [],
            preferencias: {
              tipoBicicleta: null,
              rutasFrecuentes: []
            }
          });

          console.log('✅ Cliente guardado en Mongo correctamente');
        } else {
          // Crear usuario en Mongo (para admin/personal)
          await usuarioModel.create({
            direccion,
            telefono,
            email,
            idUsuarioSql: nuevoUsuario.idUsuario.toString(),
            rol,
          });

          console.log('✅ Documento guardado en Mongo correctamente (no cliente)');
        }

        return done(null, nuevoUsuario.get({ plain: true }), 'Registro exitoso');
      } catch (error) {
        console.error('❌ Error durante el registro:', error);
        return done(error);
      }
    }
  )
);


// Login
passport.use(
  'local.usuarioLogin',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) return done(null, false, 'Usuario no encontrado');

        const valid = await comparePassword(password, usuario.password);
        if (!valid) return done(null, false, 'Contraseña incorrecta');

        const mongoData = await usuarioModel.findOne({ idUsuarioSql: usuario.idUsuario.toString() });

        return done(null, {
          ...usuario.get({ plain: true }),
          detalles: mongoData ? mongoData.toObject() : null,
        }, `Bienvenido ${descifrarDatos(usuario.nombreCompleto)}`);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialización
passport.serializeUser((user, done) => {
  done(null, { id: user.idUsuario });
});

passport.deserializeUser(async (obj, done) => {
  try {
    const user = await Usuario.findByPk(obj.id);
    if (!user) return done(null, false);
    const mongoData = await usuarioModel.findOne({ idUsuarioSql: obj.id.toString() });
    done(null, {
      ...user.get({ plain: true }),
      detalles: mongoData ? mongoData.toObject() : null,
    });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
