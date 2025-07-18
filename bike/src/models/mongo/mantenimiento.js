const mongoose = require('mongoose');

const mantenimientoSchema = new mongoose.Schema({
  mantenimientoPostgresId: String, // referencia a Postgres
  fechaInicio: { type: Date, required: true },
  tipo: { type: String, required: true },
  estacionId: { type: String, required: true },
  descripcion: { type: String, required: true }
}, {
  collection: 'mantenimientos'
});

const Mantenimiento = mongoose.model('mantenimientos', mantenimientoSchema);
module.exports = Mantenimiento;
