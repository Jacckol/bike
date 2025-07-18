const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/key.example');

// Configuración de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión en Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado de MongoDB');
});

// Función de conexión mejorada
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('🚀 MongoDB conectado correctamente');
  } catch (err) {
    console.error('💥 FALLA CRÍTICA en conexión MongoDB:', err.message);
    process.exit(1);
  }
};

// Manejo de cierre de aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada por terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar conexión MongoDB:', err);
    process.exit(1);
  }
});

// Iniciar conexión
connectDB();

// Exportar modelos MongoDB
const usuarioModel = require('../models/mongo/usuario');
const clienteModel = require('../models/mongo/cliente');
const bicicletaModel = require('../models/mongo/bicicleta');
const alquilerModel = require('../models/mongo/alquiler');
const beaconModel = require('../models/mongo/beacon');
const estacionModel = require('../models/mongo/estacion');
const inventarioModel = require('../models/mongo/inventario');
const mantenimientoModel = require('../models/mongo/mantenimiento');
const personalModel = require('../models/mongo/personal');



module.exports = {
  usuarioModel,
  clienteModel,
  bicicletaModel,
  alquilerModel,
  beaconModel,
  estacionModel,
  inventarioModel,
  mantenimientoModel,
  personalModel,
};