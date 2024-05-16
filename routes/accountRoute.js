// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Route to handle requests for building login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle requests for building registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post("/register",  utilities.handleErrors(accountController.registerAccount));


module.exports = router;