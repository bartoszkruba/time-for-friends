const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const TimezoneSchema = Schema({
  name: {
    type: String,
    required: true
  },
  currentTime: {
    type: String
  }
});

module.exports = mongoose.model("Timezone", TimezoneSchema);