const utilities = require("../utilities"); // Importing the utilities module
const accountModel = require("../models/account-model"); // Importing the account model
const bcrypt = require("bcryptjs"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for generating tokens
const { cookie } = require("express-validator");
const cookieParser = require("cookie-parser");
require ("dotenv").config(); // Loading environment variables

// Function to render the login view
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav(); // Getting navigation data
    // Rendering the login view template with title, navigation data, and no errors
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

// Function to render the registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav(); // Getting navigation data
    // Rendering the registration view template with title, navigation data, and no errors
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

// Function to render the account view
async function buildAccount(req, res, next){
    let nav = await utilities.getNav(); // Getting navigation data
    const account_id = res.locals.accountData.account_id;
    const data = await accountModel.getInventoryByReview(account_id);
    const MyReviews = await utilities.manageReviews(data);
    // Rendering the account view template with title, navigation data, and no errors
    res.render("account/account", {
        title: "Account Management",
        nav,
        errors: null,
        MyReviews,
    })
}

// Function to process login request
async function accountLogin(req, res) {
    let nav = await utilities.getNav(); // Getting navigation data
    const { account_email, account_password } = req.body; // Extracting email and password from request body
    // Retrieving account data from database based on email
    const accountData = await accountModel.getAccountByEmail(account_email);
    // Checking if account data exists
    if (!accountData) {
        // Flashing an error message and rendering the login view with the provided email and no errors
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
        return;
    }
    try {
        // Comparing the provided password with the hashed password in the database
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            // Deleting the password from the account data
            delete accountData.account_password;
            // Generating an access token
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            // Setting the token in a cookie
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            // Redirecting to the account page
            return res.redirect("/account/");
        }
    } catch (error) {
        // Handling error if password comparison fails
        return new Error('Access Forbidden');
    }
}

// Function to process registration
async function registerAccount(req, res) {
    let nav = await utilities.getNav(); // Getting navigation data
    const { account_firstname, account_lastname, account_email, account_password } = req.body; // Extracting account details from request body
    
    let hashedPassword; // Variable to store hashed password
    
    try {
        // Hashing the password before storing
        hashedPassword = await bcrypt.hashSync(account_password, 10); // Hashing the password with salt
    } catch (error) {
        // Handling error if password hashing fails
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }

    // Registering the account with hashed password
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        // Flashing success message and rendering the login view on successful registration
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        );
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        });
    } else {
        // Flashing error message and rendering the registration view on failed registration
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        });
    }
}

async function buildUpdateAccount(req, res){
    let nav = await utilities.getNav();
    
    res.render("account/edit-account",{
        title: "Edit Account",
        nav,
        errors: null,
    })
}

async function updateAccount(req, res){
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    const account_id = parseInt(res.locals.accountData.account_id);
    let accountData = "";
    if (!account_password){
        const updateResult = await accountModel.updateAccount(
            account_firstname, 
            account_lastname, 
            account_email,
            account_id,
        )

        if(updateResult){

            req.flash(
                "notice",
                `Congratulations, your information has been updated.`
            );
            accountData = await accountModel.getAccountByEmail(account_email);
        }

    }else{
        // Comparing the provided password with the hashed password in the database
        let hashedPassword = await bcrypt.hashSync(account_password, 10);
        const updateResult = await accountModel.updatePassword(hashedPassword, account_id);
        if(updateResult){

            req.flash(
                "notice",
                `Congratulations, your information has been updated.`
            );
            accountData = updateResult;
        }
    }

        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET);
        // Setting the token in a cookie
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
        }
    res.redirect("/account");
}

async function logout(req, res, next){
    res.clearCookie('jwt');
    res.redirect("/");
}
module.exports = { logout, buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildUpdateAccount, updateAccount }; // Exporting controller functions
