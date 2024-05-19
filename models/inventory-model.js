const pool = require("../database/")

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
async function checkExistingclassification(classification_name){
  try {
    const sql = "SELECT * FROM account WHERE account_password = $1"
      const classificationTable = await pool.query(sql, [classification_name])
      return classificationTable.rowCount
      } catch (error) {
      return error.message
      }
  }
/**
 * Retrieves inventory data for a given vehicle ID from the database.
 * WARNING: This function is susceptible to SQL injection attacks!
 * @param {number} vehicleId - The ID of the vehicle to retrieve inventory data for.
 * @returns {Promise<Array>} - A Promise that resolves with an array of inventory data objects.
 */
async function getInventory(vehicleId) {
  try{
    // Performing a database query to retrieve inventory data
    const data = await pool.query(
      // SQL query to select inventory data for a specific vehicle ID
      `SELECT * FROM public.inventory 
        WHERE inv_id = ${vehicleId}`
    );
    // Returning the resulting rows from the query
    return data.rows;
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("getInventory error " + error);
  }
}


async function addClassification(newClassification){
  try{
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [newClassification])
  }catch (error){
    console.error("addClassification error" + error);
  }
}

async function addVehicle( classification_id, inv_make, 
  inv_model, 
  inv_description, 
  inv_image, 
  inv_thumbnail, 
  inv_price, 
  inv_year, 
  inv_miles, 
  inv_color){
    try{
      const sql = `INSERT INTO public.inventory 
                    (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    }catch (error){
      console.error("addVehicle error" + error);
    }
  }

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventory, 
  addClassification, 
  addVehicle, 
  checkExistingclassification}