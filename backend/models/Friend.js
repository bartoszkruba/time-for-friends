const {Schema} = require('mongoose');
const {ObjectId} = require('mongoose').Schema.Types;
const mongoose = require('mongoose');

const FriendSchema = Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  emails: [
    {
      type: String,
    }
  ],
  phoneNumbers: [{
    type: String
  }],
  timezone: {
    type: ObjectId,
    ref: "Timezone",
    required: true
  }
});

module.exports = mongoose.model("Friend", FriendSchema);