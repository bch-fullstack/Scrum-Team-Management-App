const mongoose = require('mongoose');

// userstory schema
const Schema = mongoose.Schema;

const userstorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  descr: String,
});

// userstory model - creating in DB a collection called userstories
const Userstory = mongoose.model('Userstory', userstorySchema);

module.exports = Userstory;
