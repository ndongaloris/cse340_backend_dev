// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList");

// Event listener for the dropdown list
classificationList.addEventListener("change", function () { 
    let classification_id = classificationList.value; // Get the selected classification_id
    console.log(`classification_id is: ${classification_id}`); // Log the selected classification_id
    let classIdURL = "/inv/getInventory/" + classification_id; // Construct the URL for fetching inventory data
    fetch(classIdURL) // Fetch inventory data based on the selected classification_id
    .then(function (response) { // Handle the response
        if (response.ok) { // Check if the response is OK
            return response.json(); // Parse the JSON data from the response
        } 
        throw Error("Network response was not OK"); // Throw an error if the response is not OK
    }) 
    .then(function (data) { // Process the retrieved data
        console.log(data); // Log the retrieved data
        buildInventoryList(data); // Call the function to build the inventory list
    }) 
    .catch(function (error) { // Handle any errors that occur during the process
        console.log('There was a problem: ', error.message); // Log the error message
    }); 
});

'use strict';

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); // Get the element to display the inventory
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; // Table header row
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { // Loop through each vehicle data
        console.log(element.inv_id + ", " + element.inv_model); // Log the vehicle ID and model
        // Populate table rows with vehicle information and action links
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; // Vehicle make and model
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; // Link to edit the vehicle
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; // Link to delete the vehicle
    }); 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; // Inject the HTML table into the DOM
}
