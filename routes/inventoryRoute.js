// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const classValidate = require('../utilities/management-validation');

/***********************
 * Get section
************************/

//route that send to the management page
router.get("/", invController.buildManagement)
// route that build the ability to add a classification
router.get("/add-classification", invController.buildAddClassification)
// route that add the ability to add a inventory
router.get("/add-inventory", invController.buildAddInventory)
// Route to handle requests for building inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to handle requests for building a single inventory page
router.get("/detail/:singleViewId", invController.BuildSinglePageId);
// Route to trigger intentional error
router.get("/serverError", invController.serverError);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// route to update an item in the inventory
router.get("/edit/:inventoryId", utilities.handleErrors(invController.updateInventory));

/*****************************
 * Post Section
 * ***************************/ 

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