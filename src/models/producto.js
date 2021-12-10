const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  nombre: String,
  precio: String,
  cantidad: String,
  categoria: String,
  filename: String,
  path: String,
  originalname: String,
  mimetype: String,
  size: Number,
  created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('producto', userSchema);