// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8884;                 // Set a port number at the top so it's easy to change in the future

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
       let query1 ='SELECT * FROM Tickets;';
        db.pool.query(query1,function(err, rows, fields){
            res.render('index', {data: rows});         // This function literally sends the string "The server is running!" to the computer
        });
    });                                         // requesting the web site.


app.get('/ticket_chats', (req, res) => {
    let query2 ='SELECT * FROM Ticket_Chats;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('ticket_chats', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
    });

app.get('/users', (req, res) => {
    let query2 ='SELECT * FROM Users;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('users', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
    });
app.get('/tags', (req, res) => {
    let query2 ='SELECT * FROM Tags;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('tags', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
    });
app.get('/agents_has_tickets', (req, res) => {
    let query2 ='SELECT * FROM Agents_has_Tickets;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('agents_has_tickets', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
    });
app.get('/agents', (req, res) => {
    let query2 ='SELECT * FROM Agents;';
        db.pool.query(query2,function(err, rows2, fields){
            res.render('agents', {data: rows2});         // This function literally sends the string "The server is running!" to the computer
        });
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
        ticket_status = 5
    }

   
    // Create the query and run it on the database
    add_row_to_table = `INSERT INTO Tickets (Users_user_id, ticket_subject, ticket_body, ticket_status,tag_name) 
    VALUES (${data.Users_user_id}, '${data.ticket_subject}', '${data.ticket_body}', ${ticket_status},'${data.tag_name}')`;
    db.pool.query(add_row_to_table, function(error, rows, fields){
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

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


