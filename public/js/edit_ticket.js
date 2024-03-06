function edit_button(ticket_id, Users_user_id,ticket_subject,ticket_body,ticket_status,tag_name){
    
   
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

function edit_button(user_id,user_name,user_email,user_Phone_number){
    
   
    const user_data ={
        user_id:user_id,
        name:user_name,
        email:user_email,
        phone:user_Phone_number,
       

    }
    
    sessionStorage.setItem('user',JSON.stringify(user_data));
    window.location.href ='/edit_user';
    
}