
// Get the objects we need to modify
//  Based on https://github.com/osu-cs340-ecampus/nodejs-starter-app 
let updatePersonForm = document.getElementById('edit-user-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let user_id = document.getElementById("user_id_place");
    let user_name = document.getElementById("input-user_name");
    let user_email = document.getElementById("input-user_email");
    let user_Phone_number =document.getElementById("input-user_Phone_number")
    
   
    // Get the values from the form fields
    let user_id_value = user_id.value;
    let user_name_value = user_name.value;
    let user_email_value = user_email.value;
    let user_Phone_number_value=user_Phone_number.value;
 
    
    // if null value abort
    
   
    // Put our data we want to send in a javascript object
    let data = {
        user_id:user_id_value,
        name:user_name_value,
        email:user_email_value,
        phone:user_Phone_number_value
        
    
    }
   console.log(data) 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           console.log("The row has updated")
            // Add the new data to the table
            //updateRow(xhttp.response, id,user_id,subject,body,tag);
            window.location.href ='/users';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with updating the ticket")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})




