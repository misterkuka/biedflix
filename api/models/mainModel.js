'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  name: {
    type: String,
    required: 'Proszę podać tytuł filmu'
  },
  filename: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movies',MovieSchema);
