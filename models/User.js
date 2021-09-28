//Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new error("Email not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: Number,
    default: 0,
  },
  verify: {
    type: String,
    default: "",
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
});

//render send user json
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.veryfy;
  return userObject;
};

//match login user
userSchema.statics.matchUser = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Email not match or not exist");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password not match");
  }
  return user;
};

//hash password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//create token
userSchema.methods.createToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.PRIVATE_JWT, {
    expiresIn: "5m",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
