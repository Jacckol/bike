const mongoose = require('mongoose');

const alquilerSchema = new mongoose.Schema({
  idAlquilerSql: {
    type: String,
    required: true,
    unique: true
  },
  climaInicio: {
    temperatura: Number,
    humedad: Number,
    descripcion: String
  },
  notasCliente: String,
  historialEventos: [{
    fecha: Date,
    evento: String
  }]
}, {
  timestamps: true,
  collection: 'alquileres'
});

module.exports = mongoose.model('Alquiler', alquilerSchema);
