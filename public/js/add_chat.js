// Get the objects we need to modify
let addTicketForm = document.getElementById('add-chat-form-ajax');

// Modify the objects we need
addTicketForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
   
    let ticket_id=document.getElementById("add-message-ticket-id");
    let chat_history=document.getElementById("input-chat_history");
    let user_id=document.getElementById("message-user-id");
    let agent_id=document.getElementById("messaged-agent-id");
   
    
    
    // Get the values from the form fields
    let ticket_id_value = ticket_id.value;
    let chat_history_value = chat_history.value;
    let user_id_value = user_id.value;
    let agent_id_value = agent_id.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        ticket_id: ticket_id_value,
        chat:chat_history_value,
        user_id:user_id_value,
        agent_id:agent_id_value
      
    }
   
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-chat-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //console.log(data)
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            
            // Clear the input fields for another transaction
            ticket_id.value = '';
             chat_history.value = '';
             user_id.value = '';
             agent_id.value = '';
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the inputing a chat entry.")
            window.alert('Please fill out all fields.');
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 

addRowToTable = (input) => {
 
    let parsedData = JSON.parse(input);
    const newRow = parsedData[0];
 
 
    let currentTable = document.getElementById("chats_table");
 
 
    let row = document.createElement("TR");
 
    // Define the properties of newRow that you want to add to the table
    let properties = ['Chat Id', 'Ticket Id','Message','Date','Time','User Id','User Name','Agent Id','Agent Name'];
 
    // Iterate over the properties
   
    properties.forEach((prop) => {
        // Create a new cell
        let cell = document.createElement("TD");
        // let deleteCell = document.createElement("TD");
        // let editCell= document.createElement("TD");
        // Set the cell's content to the corresponding property value of newRow
      
      
        cell.innerHTML = newRow[prop]; // Use innerHTML or innerText depending on your content
         
        
        
      
        // Append the cell to the row
        row.appendChild(cell);
       
    });
   
    currentTable.appendChild(row);
    location.reload();
   
};