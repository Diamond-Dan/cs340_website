// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8864;                 // Set a port number at the top so it's easy to change in the future

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.set('views', __dirname + '/views');
// Database
var db = require('./database/db-connector')
// css in public 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
      
            res.render('index');         // This function literally sends the string "The server is running!" to the computer
        
    });            


app.get('/tickets', function(req, res) {
    let tag_id = req.query.tag_id;
    let ticket_status = req.query.ticket_status;
    let agents_query = "SELECT * FROM Agents"

    let query1 = "SELECT * FROM Tickets";
    if (tag_id) {
        query1 += " WHERE tag_name = (SELECT tag_type FROM Tags WHERE tag_id = " + tag_id + ")";
    }
    if (ticket_status) {
        if (tag_id) {
            query1 += " AND ticket_status = " + ticket_status;
        } else {
            query1 += " WHERE ticket_status = " + ticket_status;
        }
    }

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.error('Error executing query', error);
            return;
        }
        const change_rows = rows.map((row) => {
            const new_date_row = new Date(row.create_date).toDateString();
            const status_to_words= row.ticket_status=== 0? 'Open' :'Closed'
            return {
                ...row,
                create_date: new_date_row,
                ticket_status: status_to_words
            };
        });

        let tickets = change_rows;

        db.pool.query("SELECT * FROM Users", (error, rows, fields) => {
            if (error) {
                console.error('Error executing query', error);
                return;
            }
            let users = rows;
            db.pool.query("SELECT * FROM Tags", (error, rows, fields) => {
                if (error) {
                    console.error('Error executing query', error);
                    return;
                }
                let tags = rows
                db.pool.query(agents_query, (error, rows, fields) => {
                    let agents = rows
                    return res.render("tickets", {data: tickets, user_ids: users, department: tags, agent:agents})
                })
            })
        })
    })
});



app.get('/ticket_chats', (req, res) => {
    let ticketId = req.query['id-search'] || '';
    let userId = req.query['user-id'] || '';
    let agentId = req.query['agent-id'] || '';

    let query1 = 'SELECT chat_id, ticket_id, chat_history, chat_date, chat_time, Ticket_Chats.Users_user_id, Users.user_name, Ticket_Chats.agent_id, Agents.agent_name FROM Ticket_Chats LEFT JOIN Agents ON Ticket_Chats.agent_id=Agents.agent_id INNER JOIN Users ON Ticket_Chats.Users_user_id=Users.user_id';
    if (ticketId) {
        query1 += ` WHERE ticket_id = '${ticketId}'`;
    } else if (userId) {
        query1 += ` WHERE Users.user_id = '${userId}'`;
    } else if (agentId) {
        query1 += ` WHERE Agents.agent_id = '${agentId}'`;
    }
    let query2 = "SELECT * FROM Users INNER JOIN Tickets ON Users.user_id = Tickets.Users_user_id group by Tickets.Users_user_id";
    let query3 = "select * from Agents";
    let query4= 'SELECT ticket_id FROM Tickets ORDER BY ticket_id ASC;';
    let query5 = "select ticket_id From Ticket_Chats group by ticket_id;";
    let query6 = "Select * from Users inner join Ticket_Chats where Users.user_id = Ticket_Chats.Users_user_id group by Ticket_Chats.Users_user_id;"
    db.pool.query(query1,function(error, rows, fields){
            let tickets = rows
            if (error) {// Added error checking for K 
                // Send error
                console.error('Can not get tickets from SQL server:', err);
                res.status(500).send('Can not get tickets from SQL server');
                return;
            }
             // change date row slicing it here
             const change_rows = rows.map((row) => {
                const new_date_row = new Date(row.chat_date).toDateString(); // Formats to "Weekday Month Day Year"
                
                return {
                    ...row,
                    chat_date: new_date_row // Overwrite chat_date with new_date_row 
                };
            });
            tickets = change_rows
            
            db.pool.query(query2, (error, rows, fields) => {
            let user = rows
            db.pool.query(query3, (error, rows, fields) => {
                let agent = rows
                db.pool.query(query4, (error, rows, fields) => {
                    let tik = rows
                    db.pool.query(query5, (error, rows, fields) => {
                        let tick = rows
                        db.pool.query(query6, (error, rows, fields) => {
                            let userSearch = rows
                            return res.render("ticket_chats", {data: tickets, users: user, agents:agent, tick_id:tik, ticket_id:tick, user_search_ids:userSearch})
                        })
                    })
                })
            })    
           })
          
        });
    });;  


app.get('/users', (req, res) => {
    let name = req.query.name;
    let email = req.query.email;
    let number = req.query['search-number'];

    let query = 'SELECT * FROM Users';
    if (name) {
        query += " WHERE user_name = '" + name + "'";
    } else if (email) {
        query += " WHERE user_email = '" + email + "'";
    } else if (number) {
        query += " WHERE user_Phone_number = '" + number + "'";
    }

    db.pool.query(query, function(err, rows, fields){
        if (err) {
            console.error('Error executing query', err);
            return;
        }
        res.render('users', {data: rows});
    });
});

app.get('/tags', (req, res) => {
    let query2 ='SELECT * FROM Tags ORDER BY tag_id;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('tags', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
    });


app.get('/agents_has_tickets', (req, res) => {
    let agentIDSearch = req.query.agentIDSearch;
    let agentNameSearch = req.query.agentNameSearch;
    let ticketIdSearch = req.query.ticketIdSearch;

    let query1 = 'SELECT Agents_has_Tickets.agent_id, Agents.agent_name, Agents_has_Tickets.ticket_id FROM Agents_has_Tickets LEFT JOIN Agents ON Agents_has_Tickets.agent_id=Agents.agent_id';

    if(agentIDSearch){
        query1 += ` WHERE Agents_has_Tickets.agent_id = ${agentIDSearch}`;
    }

    else if(agentNameSearch){
        query1 +=  ` WHERE Agents.agent_name = '${agentNameSearch}'`;
    }

    else if(ticketIdSearch){
        query1 += ` WHERE Agents_has_Tickets.ticket_id = ${ticketIdSearch}`;
    }

    let query2 = 'SELECT * FROM Agents';
    let query3 = 'SELECT Tickets.ticket_id FROM Tickets INNER JOIN Agents_has_Tickets ON Tickets.ticket_id = Agents_has_Tickets.ticket_id GROUP BY Tickets.ticket_id';

    db.pool.query(query1,function(err, rows, fields){
        let table = rows
        db.pool.query(query2, (error, rows, fields) => {
            let agent = rows
            db.pool.query(query3, (error, rows, fields) => {
                let grouped_tickets = rows
                res.render('agents_has_tickets', {data: table, agents:agent, tickets:grouped_tickets});
            })
        })
    });
});


app.get('/agents', (req, res) => {
    let query1 ='SELECT * FROM Agents;';
    let id = req.query.agentDropId;
    let name = req.query.agentDropName;
    if (id) {
        query1 = `SELECT * FROM Agents WHERE agent_id = ${id}`;
    }
    else if (name) {
        query1 = `SELECT * FROM Agents WHERE agent_name = '${name}'`;
    }
    let query2 ='SELECT * FROM Agents ORDER BY agent_id;';
    db.pool.query(query1,function(err, rows, fields){
        let table_data = rows
        db.pool.query(query2, (error, rows, fields) => {
            let agent = rows
            res.render('agents', {data: table_data, agents:agent});
        });
        
    });
    }); 


app.get('/edit_tickets', function(req, res)              
{
    let query1 = "select * from Tickets"
    let query2 = "select * from Users"
    let query3 = "select * from Tags"
    let query4 = "select * from Agents"
    db.pool.query(query1, (error, rows, fields) => {
        let tickets = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let users = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let tags = rows
                db.pool.query(query4, (error, rows, fields) => {
                    let agent = rows
        res.render('edit_tickets',{data: tickets, user_ids: users, department: tags, agents:agent});         
                })
            })
        })
    })
}); 
app.get('/edit_user', function(req, res)              
{
    
        res.render('edit_user');         
                
}); 
app.get('/edit_agent', function(req, res)              
{
    
        res.render('edit_agent');         
                
}); 
/*
POST

*/
// app.js - ROUTES section

app.post('/add-ticket-ajax', function(req, res) 
{
    
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let ticket_status = parseInt(data.ticket_status);
    if (isNaN(ticket_status))
    {
        ticket_status = 0
    }
    

    let add_row_to_table = `INSERT INTO Tickets (Users_user_id, ticket_subject, ticket_body, ticket_status,tag_name) 
    VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(add_row_to_table, [data.Users_user_id, data.ticket_subject, data.ticket_body, ticket_status, data.tag_name], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            //console.log(data)
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            get_new_row = `SELECT * FROM Tickets ORDER BY ticket_id DESC LIMIT 1;`;
            db.pool.query(get_new_row, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    
                }
            })
        }
    })
});

app.post('/add-tags-ajax',function(req,res){
    let data=req.body
    // let tag_name = (data.tag_name);
    // console.log(tag_name)
   
    let add_tag_query=`INSERT INTO Tags (tag_type) VALUES ('${data.tag_name}')`;
    db.pool.query(add_tag_query, function(error, result) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            get_new_row = `SELECT * FROM Tags ORDER BY Tag_id DESC LIMIT 1;`;
            db.pool.query(get_new_row, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    
                }
            })
        }
    });

});
app.post('/add-users-ajax',function(req,res){
    let data=req.body
    // let tag_name = (data.tag_name);
    // console.log(tag_name)
   
    let add_tag_query=`INSERT INTO Users (user_name,user_email,user_Phone_number) VALUES ('${data.user}','${data.email}',${data.phone})`;
    db.pool.query(add_tag_query, function(error, result) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            get_new_row = `SELECT * FROM Users ORDER BY user_id DESC LIMIT 1;`;
            db.pool.query(get_new_row, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    
                }
            })
        }
    });

});

app.post('/add-chat-ajax',function(req,res){
    let data=req.body
    // let tag_name = (data.tag_name);
    // console.log(tag_name)
    let agent_id=data.agent_id
    if(agent_id==="")
    {
        agent_id= null
    }

    let add_tag_query=`INSERT INTO Ticket_Chats (ticket_id,chat_history,Users_user_id, agent_id) 
    VALUES(?,?,?,?)` ;
    db.pool.query(add_tag_query,[data.ticket_id, data.chat, data.user_id, agent_id], function(error, result) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            get_new_row = `SELECT * FROM Ticket_Chats ORDER BY chat_id DESC LIMIT 1;`;
            db.pool.query(get_new_row, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    
                }
            })
        }
    });

});
app.post('/add-agent-ajax',function(req,res){
    let data=req.body
 
   
    let add_tag_query=`INSERT INTO Agents (agent_name) VALUES ('${data.agent_name}')`;
    db.pool.query(add_tag_query, function(error, result) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            get_new_row = `SELECT * FROM Agents ORDER BY agent_id DESC LIMIT 1;`;
            db.pool.query(get_new_row, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    
                }
            })
        }
    });

});

app.post('/claim-ticket-ajax', function(req, res) {
    let data = req.body;

    // check for nulls
    let agentId = parseInt(data.agent_id);
    if (isNaN(agentId)) {
        agentId = null;
    }

    let ticketId = parseInt(data.ticket_id);
    if (isNaN(ticketId)) {
        res.status(400).send({ message: 'Ticket ID is required.' });
        return;
    }

    // insert into intersection table
    let claimTicketQuery = `INSERT INTO Agents_has_Tickets (agent_id, ticket_id) VALUES (${agentId}, ${ticketId})`;
    db.pool.query(claimTicketQuery, function(error, result) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.status(200).send({ message: 'Ticket claimed successfully.' });
        }
    });
});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
/*
    DELETE
*/
app.delete('/delete_ticket_ajax', function(req,res,next){


let data =req.body;
let ticket_id=parseInt(data.id);
let delete_ticket_by_id= `DELETE FROM Tickets WHERE ticket_id=?`;
db.pool.query(delete_ticket_by_id, [ticket_id], function(error, rows, fields){
    if (error) {

    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    console.log(error);
    res.sendStatus(400);
    }

    else
    {
        // Run the second query
        db.pool.query(delete_ticket_by_id, [ticket_id], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
    }
})});

app.delete('/delete_claimed_ajax', function(req,res,next){


    let data =req.body;
    let user_id=parseInt(data.id);
    let ticket_id=parseInt(data.ticket)
    let delete_ticket_by_id= `DELETE FROM Agents_has_Tickets WHERE agent_id=? and ticket_id=?`;
    db.pool.query(delete_ticket_by_id, [user_id, ticket_id], function(error, rows, fields){
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        else
        {
            // Run the second query
            db.pool.query(delete_ticket_by_id, [user_id,ticket_id], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })});

    app.delete('/delete_user_ajax', function(req,res,next){


        let data =req.body;
        let user_id=parseInt(data.id);
        let delete_ticket_by_id= `DELETE FROM Users WHERE user_id=?`;
        db.pool.query(delete_ticket_by_id, [user_id], function(error, rows, fields){
            if (error) {
        
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
        
            else
            {
                // Run the second query
                db.pool.query(delete_ticket_by_id, [user_id], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
        })});
/*
Edit(put)
*/
app.put('/put-ticket-ajax',function(req,res,next)
{
    
    let data =req.body;
    let ticket_id=parseInt(data.id)
    let Users_user_id=parseInt(data.user_id)
    let ticket_subject=data.subject
    let ticket_body=data.body
    let ticket_status=parseInt(data.status)
    let tag_name=data.tag
    //console.log(req.body)
    let query_update_ticket= `UPDATE Tickets SET Users_user_id=?,  ticket_subject=?, ticket_body=?, ticket_status=?, tag_name=? WHERE ticket_id=?`
   
   
    db.pool.query(query_update_ticket,[Users_user_id,ticket_subject,ticket_body,ticket_status,tag_name, ticket_id], function(error,rows,fields)
    {
        if (error){
            console.log("error with query_update_ticket");
            res.sendStatus(400);
        }
        else
        {
           
           // console.log(rows)
            
            res.send(rows);
            
        }

    }
    )
});

app.put('/put-user-ajax',function(req,res,next)
{
    
    let data =req.body;
    let user_id=parseInt(data.user_id)
    let name=data.name
    let email=data.email
    let phone=parseInt(data.phone)
   
    //console.log(req.body)
    let query_update_ticket= `UPDATE Users SET user_name=?,  user_email=?, user_Phone_number=? WHERE user_id=?`
   
   
    db.pool.query(query_update_ticket,[name,email,phone,user_id], function(error,rows,fields)
    {
        if (error){
            console.log("error with query_update_ticket");
            res.sendStatus(400);
        }
        else
        {
           
           // console.log(rows)
            
            res.send(rows);
            
        }

    }
    )
});
app.put('/put-agent-ajax',function(req,res,next)
{
    
    let data =req.body;
    let agent_id=parseInt(data.id)
    let name=data.name
    
   
    //console.log(req.body)
    let query_update_ticket= `UPDATE Agents SET agent_name=? WHERE agent_id=?`
   
   
    db.pool.query(query_update_ticket,[name,agent_id], function(error,rows,fields)
    {
        if (error){
            console.log("error with query_update_ticket");
            res.sendStatus(400);
        }
        else
        {
           
           // console.log(rows)
            
            res.send(rows);
            
        }

    }
    )
});

/*
Handlebars helpers
*/

