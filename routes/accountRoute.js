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

router.get("/", 
        utilities.checkLogin,
        utilities.handleErrors(accountController.buildAccount
            
        ))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
)

module.exports = router;