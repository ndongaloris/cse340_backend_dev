const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body("classificationName")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please a good classification name with at least three character.")
            .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingclassification(classification_name)
            if (classificationExists){
                throw new Error("CLassification exists already.")
            }
            }),
        ]
    
    }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const form = await utilities.buildNewClassification();
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            form,
            classification_name,
        })
        return
        }
        next()
    }


validate.registationRules = () => {
    return [
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
    

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
    
        body("inv_description")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
        }
        }),
    
        body("inv_image")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        
        body("inv_price")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

        body("inv_year")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

        body("inv_color")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        ]
    }


validate.checkInventoryData = async (req, res, next) => {
    const {  classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color, } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const selectList = await utilities.buildClassificationList();
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            selectList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
        })
        return
        }
        next()
    }

module.exports = validate;
