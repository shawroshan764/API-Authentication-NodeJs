const e = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function(next) {
  try {
    const saltRounds = 10
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    next(error)
  }
}
const User = mongoose.model("user", UserSchema)

module.exports = User;