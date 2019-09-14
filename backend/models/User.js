const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const {ObjectId} = require('mongoose').Schema.Types;

const UserSchema = Schema({
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  friends: [
    {
      type: ObjectId,
      ref: "Friend"
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);