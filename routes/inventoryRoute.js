// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const classValidate = require('../utilities/management-validation');

router.get("/", invController.buildManagement)

router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory)

// Route to handle requests for building inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to handle requests for building a single inventory page
router.get("/detail/:singleViewId", invController.BuildSinglePageId);

// Route to trigger intentional error
router.get("/serverError", invController.serverError);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.post(
    "/add-classification",
    classValidate.classificationRules(), 
    classValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification));

router.post(
    "/add-inventory", 
    classValidate.inventoryRules(), 
    classValidate.checkInventoryData,
    utilities.handleErrors(invController.addVehicle));

module.exports = router;