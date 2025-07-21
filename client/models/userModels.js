const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //   first_name: { type: String, required: true },
  //   last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //   fun_fact: { type: String },
  //   avatar: { type: String },
  //   voice_sample: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
