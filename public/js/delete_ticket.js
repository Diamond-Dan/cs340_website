
function delete_ticket(ticket_id){

    let data={
        id: ticket_id
    };

var xhttp = new XMLHttpRequest();
xhttp.open("DELETE", "/delete_ticket_ajax",true);
xhttp.setRequestHeader("Content-type", "application/json");

xhttp.onreadystatechange=()=>{
    if (xhttp.readyState == 4 && xhttp.status == 204) {
       
        // Add the new data to the table
        delete_row(ticket_id);

    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("Could not delete ticket ID")
    }
}
// Send the request and wait for the response
xhttp.send(JSON.stringify(data)); 

}

function delete_claimed_ticket(agent_id,ticket_id){

    let data={
        id: agent_id,
        ticket: ticket_id
    };

var xhttp = new XMLHttpRequest();
xhttp.open("DELETE", "/delete_claimed_ajax",true);
xhttp.setRequestHeader("Content-type", "application/json");

xhttp.onreadystatechange=()=>{
    if (xhttp.readyState == 4 && xhttp.status == 204) {
       
        // Add the new data to the table
        delete_row_claimed_ticket(agent_id,ticket_id);

    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("Could not delete agent claiming a ticket")
    }
}
// Send the request and wait for the response
xhttp.send(JSON.stringify(data)); 

}

function delete_user(user_id){

    let data={
        id: user_id
    };

var xhttp = new XMLHttpRequest();
xhttp.open("DELETE", "/delete_user_ajax",true);
xhttp.setRequestHeader("Content-type", "application/json");

xhttp.onreadystatechange=()=>{
    if (xhttp.readyState == 4 && xhttp.status == 204) {
       
        // Add the new data to the table
        delete_user_row(user_id);

    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("Could not delete user ID")
    }
}
// Send the request and wait for the response
xhttp.send(JSON.stringify(data)); 

}

// delete rows function
function delete_row(ticket_id){

    let table= document.getElementById("ticket_table");
    for (let i=0; i<table.rows.length; i++)
    {
       
        if(table.rows[i].getAttribute("data-value")==ticket_id){
            table.deleteRow(i);
            break;
        }
    }

}
function delete_row_claimed_ticket(agent_id,ticket_id){
    console.log(agent_id)
    let table= document.getElementById("agent_ticket_table");
    for (let i=0; i<table.rows.length; i++)
    {
       
        if((table.rows[i].getAttribute("data-value")==agent_id) && (table.rows[i].getAttribute("ticket-value")==ticket_id))
        {
            table.deleteRow(i);
            console.log(table.row[i])
            break;
        }
    }

}
// delete rows function
function delete_user_row(user_id){

    let table= document.getElementById("user_table");
    for (let i=0; i<table.rows.length; i++)
    {
       
        if(table.rows[i].getAttribute("data-value")==user_id){
            table.deleteRow(i);
            break;
        }
    }

}