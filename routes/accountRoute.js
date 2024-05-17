// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');
const { render } = require("ejs");

// Route to handle requests for building login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle requests for building registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.loginAccount),
    // (req, res) => {
    //     res.status(200).send('login process')
    // }
)

module.exports = router;