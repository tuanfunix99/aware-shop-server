//Dependencies
const User = require("../models/User");
const nodemailer = require("nodemailer");
const { verify } = require("../utils/verify");
const templateVerify = require("../services/templateVerify");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "minggu220399@gmail.com", // generated ethereal user
    pass: "jgprkdwwgdplxvyi", // generated ethereal password
  },
});

//controller handle login user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.matchUser(email, password);
    if (!user) {
      throw new Error("User not exist");
    }
    //check verify email
    if (!user.isVerify) {
      throw new Error("Your account is not verify. Please check your email");
    }
    //create new token
    const token = await user.createToken();
    //set cookie
    res.clearCookie("token");
    res.cookie("token", token, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      httpOnly: true,
    });
    //response result
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//controller handle register user
exports.register = async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    //create verify string
    const vf = verify();
    user.verify = vf;
    await user.save();
    //send mail verify
    await transporter.sendMail({
      from: "Admin minggu 👻", // sender address
      to: user.email, // list of receivers
      subject: "Token Verify", // Subject line
      text: "Please click the link below to verify your email", // plain text body
      html: templateVerify(
        process.env.ROOT_DOMAIN + "/api/auth/verify/" + vf + "/" + user._id
      ),
    });
    //create new token
    const token = await user.createToken();
    //set cookie
    res.clearCookie("token");
    res.cookie("token", token, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      httpOnly: true,
    });
    //response result
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//controller handle logout user
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//controller handle verify account
exports.verifyAccount = async (req, res, next) => {
  const userId = req.params._id;
  const token = req.params.token;
  try {
    //check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({ message: "user not exist" });
    }
    //check verify string
    if (user.verify !== token) {
      return res.status(401).send({ message: "Verify token not match" });
    }
    user.isVerify = true;
    user.verify = "";
    await user.save();
    //response to login
    res.redirect("/login");
  } catch (error) {
    res.status(401).send(error.message);
  }
};
