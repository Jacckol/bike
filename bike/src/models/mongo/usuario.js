const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
   direccion: {
        type: String,
        required: false
    },
  telefono: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        lowercase: true
    },
  idUsuarioSql: { type: String,
        required: true,
        unique: true },
  rol: { type: String, enum: ['admin', 'personal', 'cliente'], default: 'personal' },
  fechaRegistro: { type: Date, default: Date.now }
}, {
  collection: 'usuarios'
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;