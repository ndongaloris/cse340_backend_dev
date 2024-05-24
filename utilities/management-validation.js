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

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => { // Function to check classification data and return errors if any
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) { // If there are validation errors
        let nav = await utilities.getNav()
        const form = await utilities.buildNewClassification()
        res.render("inventory/add-classification", { // Render the add classification page with errors
            errors,
            title: "Add New Classification",
            nav,
            form,
            classification_name,
        })
        return
    }
    next() // Move to the next middleware function
}

validate.inventoryRules = () => { // Defining validation rules for inventory data
    return [
        // Validation rules for various fields
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
            inv_color
        })
        return
    }
    next() // Move to the next middleware function
}

module.exports = validate // Exporting the validate object containing validation functions
