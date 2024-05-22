const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data);
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
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

Util.getManagementLinks = async function(req, res, nest){
    return links = `<div id="managementLinks" >
                        <a href="/inv/add-classification">Add New Classification</a>
                        <a href="/inv/add-inventory">Add New Vehicle</a>
                    </div>`;
}

Util.buildNewClassification = async function(res, req, next){
    return form = `<form action="/inv/add-classification" id="newClassificationForm" method="post">
                    <h3>Classification Name</h3>
                    <label>NAME MUST BE ALPHABETIC CHARACTERS ONLY<input type="text" name="classificationName" pattern="^[a-zA-Z]*$" required></label>
                    <button type="submit">Add Classification</button>
                </form>`
}


Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = `<form action="/inv/add-inventory"  method="post" id="newVehicleForm">
        <select name="classification_id" id="classificationList" required>`
        classificationList += "<option value=''>Choose a Classification</option>"
        data.rows.forEach((row) => {
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
        classificationList += `<label>Make<input type="text" name="inv_make" required></label>
                                <label>Model<input type="text" name="inv_model" required></label>
                                <label>Description<textarea type="text" name="inv_description" required></textarea></label>
                                <label>Image Path<input type="text" name="inv_image" value="/images/vehicles/no-image.png" required></label>
                                <label>Thumbnail Path<input type="text" name="inv_thumbnail" value="/images/vehicles/no-image.png" required></label>
                                <label>Price<input type="decimal" pattern="^[0-9]*\.?[0-9]+$" name="inv_price" placeholder="decimal or integer" required></label>
                                <label>Year<input type="number" pattern="^\d{4}$" name="inv_year" placeholder="4-digit year" required></label>
                                <label>Miles<input type="number" pattern="^\d+$" name="inv_miles" placeholder="digits only" required></label>
                                <label>Color<input type="text" name="inv_color" required></label>
                                <button type="submit">Add Vehicle</button>
                                </form>`
        return classificationList
    }
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
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
Util.BuildSingleView = async function(data) {
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
        SingleView += "<p><strong>Price:</strong> " + ' ' + vehicle.inv_price + "</p>";
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
    if (req.cookies.jwt) {
        jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
        if (err) {
            req.flash("Please log in")
            res.clearCookie("jwt")
            return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
        })
        } else {
        next()
        }
}
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
        } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
        }
    }

module.exports = Util