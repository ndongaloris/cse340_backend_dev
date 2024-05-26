const invModel = require("../models/inventory-model") // Importing inventory model
const Util = {} // Creating an object for utility functions
const jwt = require("jsonwebtoken") // Importing jsonwebtoken for token management
require("dotenv").config() // Loading environment variables

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) { // Function to construct navigation list
    let data = await invModel.getClassifications() // Retrieving classification data
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => { // Iterating over classification data to build list
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

Util.getManagementLinks = async function(req, res, nest) { // Function to get management links
    return links = `<div id="managementLinks" >
                        <a href="/inv/add-classification">Add New Classification</a>
                        <a href="/inv/add-inventory">Add New Vehicle</a>
                    </div>`;
}

Util.buildNewClassification = async function(res, req, next) { // Function to build new classification form
    return form = `<form action="/inv/add-classification" id="newClassificationForm" method="post">
                    <h3>Classification Name</h3>
                    <label>NAME MUST BE ALPHABETIC CHARACTERS ONLY<input type="text" name="classificationName" pattern="^[a-zA-Z]*$" required></label>
                    <button type="submit">Add Classification</button>
                </form>`
}

Util.buildClassificationList = async function (classification_id = null) { // Function to build classification dropdown list
    let data = await invModel.getClassifications() // Retrieving classification data
    let classificationList = `<select name="classification_id" id="classificationList" required>`
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => { // Iterating over classification data to build list
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) { // Function to build classification view grid
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details" '+' id=' + vehicle.inv_id + '"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        }
    )
    grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ************************************************
* Function to build a single view of inventory data
* ************************************************* */ 
Util.BuildSingleView = async function(data) { // Function to build single view of inventory data
    let SingleView; // Variable to hold the single view HTML
    // Start building the single view container
    SingleView = "<div id=singleView>";
    // Loop through each vehicle in the data
    data.forEach(vehicle => {
        // Add the vehicle picture section
        SingleView += "<div id=singleViewPicture>";
        SingleView += '<img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors"/>';
        SingleView += "</div>";
        // Add the vehicle details section
        SingleView += "<div id=SingleViewInfo>";
        SingleView += "<h3>" + vehicle.inv_make + ' '+ vehicle.inv_model + " Details </h3>";
        SingleView += "<p><strong>Price:$</strong> " + ' ' + Math.round(vehicle.inv_price, 2) + "</p>";
        SingleView += "<p><strong>Description:</strong> " + ' ' + vehicle.inv_description + "</p>";
        SingleView += "<p><strong>Color:</strong> " + ' ' + vehicle.inv_color + "</p>";
        SingleView += "<p><strong>Miles:</strong> " + ' ' + vehicle.inv_miles + "</p>";
        SingleView += "</div>";
    });
    // Close the single view container
    SingleView += "</div>";
    // Return the built single view HTML
    return SingleView;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) { // Check if JWT token exists in cookies
        jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) { // Verify the JWT token
        if (err) { // If token verification fails
            req.flash("Please log in")
            res.clearCookie("jwt") // Clear the JWT token
            return res.redirect("/account/login") // Redirect to login page
        }
        res.locals.accountData = accountData // Store account data in locals
        res.locals.loggedin = 1 // Set loggedin status to 1
        next() // Move to next middleware
        })
        } else { // If JWT token doesn't exist
        next() // Move to next middleware
        }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => { // Function to check if user is logged in
    if (res.locals.loggedin) { // If user is logged in
        next() // Move to next middleware
        } else { // If user is not logged in
        req.flash("notice", "Please log in.") // Set flash message
        return res.redirect("/account/login") // Redirect to login page
        }
}

module.exports = Util // Exporting the Util object containing utility functions
