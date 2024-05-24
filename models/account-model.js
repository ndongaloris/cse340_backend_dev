const pool = require("../database/"); // Importing the database pool

// Function to register an account in the database
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        // SQL query to insert account details into the database
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        // Executing the SQL query with account details and returning the result
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        // Returning error message if registration fails
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        // SQL query to check if the email exists in the database
        const sql = "SELECT * FROM account WHERE account_email = $1"
        // Executing the SQL query with the email and returning the count of rows
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        // Returning error message if an error occurs
        return error.message
    }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail (account_email) {
    try {
        // SQL query to retrieve account data based on email
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0] // Returning the first row of the result
    } catch (error) {
        // Returning error message if no matching email is found
        return new Error("No matching email found")
    }
}

/* **********************
 *   Check for existing password
 * ********************* */
async function checkExistingPassword(account_email){
    try {
        // SQL query to check if the password exists in the database
        const sql = "SELECT * FROM account WHERE account_password = $1"
        // Executing the SQL query with the password and returning the count of rows
        const password = await pool.query(sql, [account_email])
        return password.rowCount
    } catch (error) {
        // Returning error message if an error occurs
        return error.message
    }
}

// Exporting functions to be used in other modules
module.exports = {registerAccount, getAccountByEmail,checkExistingEmail, checkExistingPassword}
