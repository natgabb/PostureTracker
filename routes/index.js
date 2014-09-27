"use strict";

var socket = require("../controllers/socket");


exports.index = function(req, res){
  res.render('index', { title: 'PostureTracker' });
};

exports.android = function(req, res) {
  var body;
  if (req.body) {
    body = req.body;
    body.payload = JSON.parse(body.payload); 
  }
  
  if ( !(body.event && body.source && body.payload ) ) {
    res.send(400);
  } 
  else {  
    console.log("body", body);

    socket.emit('broadcast', {
        payload: msg,
        source: from
      });
    
    res.send(200);
  }
};