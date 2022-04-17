const { string, boolean } = require('joi');
const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  name: {
    type: String
  },
  code: {
    type: Number,
  },
  codename: {
    type: String,
  },
  division_type: {
    type: String,
  },
  phone_code: {
    type: Number
  },
  districts: [
    {
      name: String,
      code: Number,
      codename: String,
      division_type: String,
      short_codename: String,
      wards: [
        {
          name: String,
          code: Number,
          codename: String,
          division_type: String,
          short_codename: String,
        }
      ]
    }
  ]
});

const Location = mongoose.model('locations', LocationSchema);
module.exports = Location;
