function edit_button(ticket_id, Users_user_id,ticket_subject,ticket_body,ticket_status,tag_name){
    
   //  Based on https://github.com/osu-cs340-ecampus/nodejs-starter-app 
    const ticket_data ={
        id:ticket_id,
        user_id:Users_user_id,
        subject:ticket_subject,
        body:ticket_body,
        status:ticket_status,
        tag:tag_name

    }
    
    sessionStorage.setItem('ticket',JSON.stringify(ticket_data));
    window.location.href ='/edit_tickets';
    
}

function edit_user(user_id,user_name,user_email,user_Phone_number){
    
   
    const user_data ={
        user_id:user_id,
        name:user_name,
        email:user_email,
        phone:user_Phone_number
       

    }
    
    sessionStorage.setItem('user',JSON.stringify(user_data));
    window.location.href ='/edit_user';
    
}

function edit_agent(agent_id,agent_name){
    
   
    const agent_data ={
        agent_id:agent_id,
        name:agent_name
      
       

    }
    
    sessionStorage.setItem('agent',JSON.stringify(agent_data));
    window.location.href ='/edit_agent';
    
}

function edit_claimed_ticket(agent_id,ticket_id){
    
   
    const edit_claimed_data ={
        agent_id:agent_id,
        ticket_id:ticket_id
      
       

    }
    
    sessionStorage.setItem('claimed_ticket',JSON.stringify(edit_claimed_data));
    window.location.href ='/edit_agent_has_tickets';
    
}