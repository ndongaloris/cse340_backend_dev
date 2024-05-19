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

module.exports = validate;
