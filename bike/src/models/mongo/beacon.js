const mongoose = require('mongoose');

const beaconSchema = new mongoose.Schema({
  beaconId: Number,
  serialNumber: { type: String, unique: true, required: true },
  date: { type: Date, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  estadoBeacon: String,
  observaciones: String
}, {
  collection: 'beacons'
});

const Beacon = mongoose.model('beacons', beaconSchema);
module.exports = Beacon;
