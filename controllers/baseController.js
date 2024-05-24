const utilities = require("../utilities/"); // Importing the utilities module
const baseController = {}; // Initializing the base controller object

// Controller function to render the home page
baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav(); // Getting navigation data
    // Rendering the home page template with title and navigation data
    res.render("index", {title: "Home", nav});
    // Adding a flash message (not displayed since it's after the response is sent)
    req.flash("notice", "This is a flash message.");
}

module.exports = baseController; // Exporting the base controller
