//  Based on https://github.com/osu-cs340-ecampus/nodejs-starter-app 
// Get the objects we need to modify
let updatePersonForm = document.getElementById('edit-agent-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let agent_id = document.getElementById("agent_id_place");
    let agent_name = document.getElementById("input-agent_name");

   
    // Get the values from the form fields
    let agent_id_value = agent_id.value;
    let agent_name_value = agent_name.value;
 
   
    // Put our data we want to send in a javascript object
    let data = {
        id:agent_id_value,
        name:agent_name_value
    }
   console.log(data) 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-agent-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           console.log("The row has updated")
            // Add the new data to the table
            //updateRow(xhttp.response, id,user_id,subject,body,tag);
            window.location.href ='/agents';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with updating an agent name")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})




