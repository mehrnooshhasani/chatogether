const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      lowercase: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    avatar: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    social: {
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      },
      telegram: {
        type: String
      },
      github: {
        type: String
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
