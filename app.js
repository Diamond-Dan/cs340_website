// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8884;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')
/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        query1 ='SELECT * FROM Tickets;';
        db.pool.query(query1,function(err, results, fields){
            res.send(JSON.stringify(results));      // This function literally sends the string "The server is running!" to the computer
        });
    });                                         // requesting the web site.

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});