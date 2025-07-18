const mongoose = require('mongoose');

const estacionSchema = new mongoose.Schema({
  estacionIdPostgres: {
    type: String,
    required: true,
    unique: true
  },
  historialEventos: [{
    fecha: Date,
    evento: String   
  }],
  sensores: {
    temperatura: Number,
    humedad: Number
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'estaciones'
});

module.exports = mongoose.model('estaciones', estacionSchema);
