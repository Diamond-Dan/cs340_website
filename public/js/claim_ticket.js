// claim_ticket.js
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

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/claim-ticket-ajax', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                window.alert('Ticket claimed successfully.');
            } else if (xhr.readyState === 4) {
                window.alert('An error occurred while claiming the ticket.');
            }
        };
        let data = JSON.stringify({ agent_id: agentId, ticket_id: ticketId });
        xhr.send(data);
    });
});
