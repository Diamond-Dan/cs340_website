document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add_agent_ticket_table').addEventListener('submit', function(e) {
        e.preventDefault();

        let agentDropdown = document.getElementById('agent-dop');
        let agentId = agentDropdown.options[agentDropdown.selectedIndex].value;

        let ticketDropdown = document.getElementById('claim-id');
        let ticketId = ticketDropdown.options[ticketDropdown.selectedIndex].value;

        if (agentId === '' || ticketId === '') {
            window.alert('Please select both an agent and a ticket.');
            return;
        }

        let xhttp  = new XMLHttpRequest();
        xhttp .open('POST', '/claim-ticket-ajax', true);
        xhttp .setRequestHeader('Content-Type', 'application/json');
        xhttp .onreadystatechange = function () {
            if (xhttp .readyState === 4 && xhttp .status === 200) {
                window.alert('Ticket claimed successfully.');
            } else if (xhttp .readyState === 4) {
                window.alert('An error occurred while claiming the ticket.');
            }
        };
        let data = JSON.stringify({ agent_id: agentId, ticket_id: ticketId });
        xhttp .send(data);
    });
});
