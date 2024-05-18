// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/", invController.buildManagement)
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory)

// Route to handle requests for building inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to handle requests for building a single inventory page
router.get("/detail/:singleViewId", invController.BuildSinglePageId);

// Route to trigger intentional error
router.get("/serverError", invController.serverError);

router.post("/add-classification", invController.addClassification);

module.exports = router;