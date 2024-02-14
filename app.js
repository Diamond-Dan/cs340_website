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
app.use(express.static('public'));

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
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


