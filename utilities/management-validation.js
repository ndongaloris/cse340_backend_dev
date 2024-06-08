const utilities = require(".") // Importing utilities module
const { body, validationResult } = require("express-validator") // Importing body and validationResult functions from express-validator module
const validate = {} // Creating an empty object for validation functions
const invModel = require("../models/inventory-model") // Importing inventory model

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => { // Defining classification data validation rules as a function
    return [
        body("classificationName") // Validation rule for classification name
            .trim()
            .escape()
            .notEmpty()
            .matches("^[a-zA-Z]*$")
            .isLength({ min: 3 })
            .withMessage("Please enter a classification name with at least three characters.") // Custom error message if validation fails
            .custom(async (classification_name) => { // Custom validation to check if classification already exists
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists.")
                }
            }),
    ]
}


validate.checkClassificationData = async (req, res, next) => { // Function to check classification data and return errors if any
    const { classificationName } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) { // If there are validation errors
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", { // Render the add classification page with errors
            errors,
            title: "Add New Classification",
            nav,
            value: classificationName,
        })
        return
    }
    next() // Move to the next middleware function
}

validate.inventoryRules = () => { // Defining validation rules for inventory data
    return [
        // Validation rules for various fields
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please select a classification"), // on error this message is sent.

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a model name, min 3 character."), // on error this message is sent.
        
            body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a make name, min 3 character."), // on error this message is sent.

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please enter a description min 10 character."),
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .matches("^[0-9]*\.?[0-9]+$")
            .withMessage("Please enter a valid price"),

        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .matches("^[0-9]{4}$")
            .withMessage("Please enter a valid year"),


        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 })
            .matches("^[0-9]+$")
            .withMessage("Please enter a valid mile"),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a valid color"),
    ]
}

validate.checkInventoryData = async (req, res, next) => { // Function to check inventory data and return errors if any
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) { // If there are validation errors
        let nav = await utilities.getNav()
        const selectList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", { // Render the add inventory page with errors
            title: "Add New Vehicle",
            nav,
            errors,
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
    next() // Move to the next middleware function
}

module.exports = validate // Exporting the validate object containing validation functions
