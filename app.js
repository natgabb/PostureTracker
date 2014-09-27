"use strict";

// Module dependencies
//---------------------------------------------
var lessMiddleware = require('less-middleware');
var bodyParser = require('body-parser');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var io = require("socket.io");

var jsonParser = bodyParser.json();

// mongoose
//---------------------------------------------
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/postureTracker');
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});


// all environments
//---------------------------------------------
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use( function(req,res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// development only
//---------------------------------------------
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// routes
//---------------------------------------------
app.get('/', routes.index);
app.get('/:id', routes.index);
app.post('/api/android', routes.android);


// socket.io and creating server
//---------------------------------------------
var server = http.createServer(app);
var websocket = io.listen(server);
require("./controllers/socket").connect(websocket);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});