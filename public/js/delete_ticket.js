
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

function delete_row(ticket_id){

    let table= document.getElementById("ticket_table");
    for (let i=0; i<table.rows.length; i++)
    {
       
        if(table.rows[i].getAttribute("data-value")==ticket_id){
            table.deleteRow(i);
            console.log(table.row[i])
            break;
        }
    }

}