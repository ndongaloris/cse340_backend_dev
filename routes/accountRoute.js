// Needed Resources 
const express = require("express"); // Importing Express framework
const router = new express.Router(); // Creating a new router instance
const accountController = require("../controllers/accountController"); // Importing account controller
const utilities = require("../utilities"); // Importing utility functions
const regValidate = require('../utilities/account-validation'); // Importing validation functions
const { render } = require("ejs"); // Importing EJS rendering

// Route to handle requests for building login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle requests for building registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle requests for building the account view
router.get("/", 
        utilities.checkLogin, // Middleware to check if user is logged in
        utilities.handleErrors(accountController.buildAccount) // Handling errors in building account view
        );

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(), // Validation rules for registration
    regValidate.checkRegData, // Middleware to check registration data
    utilities.handleErrors(accountController.registerAccount) // Handling errors in registration process
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(), // Validation rules for login
    regValidate.checkLoginData, // Middleware to check login data
    utilities.handleErrors(accountController.accountLogin) // Handling errors in login process
);

module.exports = router; // Exporting the router for use in other modules
