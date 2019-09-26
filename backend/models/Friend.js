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
  lat: {
    type: String,
    required: false
  },
  lng: {
    type: String,
    required: false
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
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  workMarks: {
    from: {
      required: true,
      type: Number
    },
    to: {
      required: true,
      type: Number
    }
  },
  sleepMarks: {
    from: {
      required: true,
      type: Number
    },
    to: {
      required: true,
      type: Number
    }
  }
});

module.exports = mongoose.model("Friend", FriendSchema);