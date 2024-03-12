
// Get the objects we need to modify
let updateAhasTForm = document.getElementById('edit_agents_has_tickets');
const new_data= sessionStorage.getItem('claimed_ticket');
const old_data= JSON.parse(new_data);

console.log(old_data)
// Modify the objects we need
updateAhasTForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let agent_id = document.getElementById("agentIDSearch");
    let ticket_id = document.getElementById("ticketIdSearch");

   
    // Get the values from the form fields
    let agent_id_value = agent_id.value;
    let ticket_id_value = ticket_id.value;
 
   
    // Put our data we want to send in a javascript object
    let data = {
        id:agent_id_value,
        ticket_id:ticket_id_value,
        old_id:old_data.agent_id,
        old_ticket_id:old_data.ticket_id
    }
   console.log(data) 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put_has_ticket_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           console.log("The row has updated")
            // Add the new data to the table
            //updateRow(xhttp.response, id,user_id,subject,body,tag);
            window.location.href ='/agents_has_tickets';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with updating an which agent has which ticket")
            window.alert('An error occurred while claiming the ticket. Make sure the ticket is not claimed by the same agent twice');

        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})




