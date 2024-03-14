
// Get the objects we need to modify
//  Based on https://github.com/osu-cs340-ecampus/nodejs-starter-app 
let updatePersonForm = document.getElementById('edit_ticket_form_ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let ticket_id = document.getElementById("ticket_id_place");
    let user_id = document.getElementById("input-user_id");
    let ticket_subject = document.getElementById("ticket_subject");
    let ticket_body = document.getElementById("ticket_body");
    let ticket_status =document.getElementById("input-option")
    let ticket_tag = document.getElementById("input-tag_name");
   
    // Get the values from the form fields
    let ticket_id_value = ticket_id.value;
    let user_id_value = user_id.value;
    let ticket_subject_value = ticket_subject.value;
    let ticket_body_value = ticket_body.value;
    let ticket_status_value=ticket_status.value;
    let ticket_tag_value = ticket_tag.value;
    
    // if null value abort
    console.log(ticket_status.value)
    if (isNaN(ticket_id_value)) 
    {
        return;
    }
    
    if(ticket_status_value=="Closed")
    {
        ticket_status_value=1
    }
    else if(ticket_status_value=="Open")
    {
        ticket_status_value=0
    }
   
    // Put our data we want to send in a javascript object
    let data = {
        id:ticket_id_value,
        user_id:user_id_value,
        subject:ticket_subject_value,
        body:ticket_body_value,
        status:ticket_status_value,
        tag: ticket_tag_value
    
    }
   console.log(data) 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ticket-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           console.log("The row has updated")
            // Add the new data to the table
            //updateRow(xhttp.response, id,user_id,subject,body,tag);
            window.location.href ='/tickets';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with updating the ticket")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})




