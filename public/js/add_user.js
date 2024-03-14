// Get the objects we need to modify
//  Based on https://github.com/osu-cs340-ecampus/nodejs-starter-app 
let addTicketForm = document.getElementById('add-user-form-ajax');

// Modify the objects we need
addTicketForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
   
    let input_user_name=document.getElementById("input-user_name");
    let input_user_email=document.getElementById("input-user_email");
    let input_user_phone=document.getElementById("input-user_Phone_number");
    
   
    // Get the values from the form fields
    let input_user_value = input_user_name.value;
    let input_email_value = input_user_email.value;
    let input_phone_value = input_user_phone.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        user: input_user_value,
        email: input_email_value,
        phone: input_phone_value
      
    }
   
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-users-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //console.log(data)
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            
            // Clear the input fields for another transaction
            input_user_name.value = '';
            input_user_email.value= '';
            input_user_phone.value='';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the inputing a new user.")
            window.alert('Please fill out all fields for users, no duplicate email addresses are allowed.');
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 

addRowToTable = (input) => {
 
    let parsedData = JSON.parse(input);
    const newRow = parsedData[0];
 
 
    let currentTable = document.getElementById("user_table");
 
 
    let row = document.createElement("TR");
 
    // Define the properties of newRow that you want to add to the table
    let properties = ['user_name', 'user_email','User_Phone_number'];
 
    // Iterate over the properties
   
    properties.forEach((prop) => {
        // Create a new cell
        let cell = document.createElement("TD");
      
      
        cell.innerHTML = newRow[prop]; 
         
        
        
      
        // Append the cell to the row
        row.appendChild(cell);
       
    });
    
    currentTable.appendChild(row);
    location.reload();
   
};