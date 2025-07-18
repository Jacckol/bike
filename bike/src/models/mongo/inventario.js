const mongoose = require('mongoose');

const bicicletaInventarioSchema = new mongoose.Schema({
  idInventarioSql: {  
    type: String,
    required: true,
    unique: true
  },
  observaciones: { 
    type: String,
    required: false
  },
  historialEstados: [{   
    estado: { type: String },
    fecha: { type: Date, default: Date.now }
  }],
  notas: [{            
    texto: String,
    fecha: { type: Date, default: Date.now }
  }],
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'bicicletasInventario'
});

module.exports = mongoose.model('bicicletasInventario', bicicletaInventarioSchema);
