// Get the objects we need to modify
let addTicketForm = document.getElementById('add-agent-form-ajax');

// Modify the objects we need
addTicketForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
   
    let input_agent=document.getElementById("input-agent_name");
    
    
    
    // Get the values from the form fields
    let input_agent_value = input_agent.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        agent_name: input_agent_value,
      
    }
   
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-agent-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //console.log(data)
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            
            // Clear the input fields for another transaction
            input_tag.value = '';
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the inputing a tag.")
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
 
 
    let currentTable = document.getElementById("agent_table");
 
 
    let row = document.createElement("TR");
 
    // Define the properties of newRow that you want to add to the table
    let properties = ['Agent Id', 'Name'];
 
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