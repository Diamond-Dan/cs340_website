// Get the objects we need to modify
let addTicketForm = document.getElementById('add-ticket-form-ajax');

// Modify the objects we need
addTicketForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputuser_id = document.getElementById("input-user_id");
    //console.log(inputuser_id)
    let inputticket_subject = document.getElementById("input-ticket_subject");
    let inputticket_body = document.getElementById("input-ticket_body");
    let inputticket_status = document.getElementById("input-ticket_status");
    let inputtag_name = document.getElementById("input-tag_name");

    // Get the values from the form fields
    let user_idValue = inputuser_id.value;
    //console.log(user_idValue)
    let ticket_subjectValue = inputticket_subject.value;
    let ticket_bodyValue = inputticket_body.value;
    let ticket_statusValue = inputticket_status.value;
    let tag_nameValue = inputtag_name.value;

    // Put our data we want to send in a javascript object
    let data = {
        Users_user_id: user_idValue,
        ticket_subject: ticket_subjectValue,
        ticket_body: ticket_bodyValue,
        ticket_status: ticket_statusValue,
        tag_name: tag_nameValue,
    }
   
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ticket-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //console.log(data)
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            
            // Clear the input fields for another transaction
            inputuser_id.value = '';
            inputticket_subject.value = '';
            inputticket_body.value = '';
            inputticket_status.value = '';
            inputtag_name.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (input) => {
 
    let parsedData = JSON.parse(input);
    const newRow = parsedData[0];
 
 
    let currentTable = document.getElementById("ticket_table");
 
 
    let row = document.createElement("TR");
 
    // Define the properties of newRow that you want to add to the table
    let properties = ['ticket_id', 'Users_user_id', 'ticket_subject', 'ticket_body', 'create_date', 'ticket_status', 'tag_name'];
 
    // Iterate over the properties
    properties.forEach((prop) => {
        // Create a new cell
        let cell = document.createElement("TD");
 
        // Set the cell's content to the corresponding property value of newRow
        if(prop=="createdata")
            {
                const date=newRow[prop].slice(0,9)
                cell.innerHTML=date
            }
        else{
            cell.innerHTML = newRow[prop]; // Use innerHTML or innerText depending on your content
        }
        
 
        // Append the cell to the row
        row.appendChild(cell);
    });
 
    // Append the row to the table
    currentTable.appendChild(row);
};