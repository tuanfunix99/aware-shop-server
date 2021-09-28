//Dependencies
const express = require("express");
const userControllers = require("../controllers/userControllers");
const { authenticate }  = require("../middleware/auth")

//Instantiate router
const router = express.Router();

//router fetch user
router.get("/fetchuser", authenticate, userControllers.fetchuser);

//export the module
module.exports = router;
