//Dependencies
const User = require("../models/User");

//controller handle fetch user
exports.fetchuser = async (req, res, next) => {
  try {
    //response result
    res.status(200).send(req.user);
  } catch (error) {
    res.status(401).send(error.message);
  }
};
