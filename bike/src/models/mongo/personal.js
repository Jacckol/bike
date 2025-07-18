const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  estado: { type: String, required: true }
}, {
  collection: 'personal'
});

const Personal = mongoose.model('personal', personalSchema);
module.exports = Personal;
