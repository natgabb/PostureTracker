"use strict";

var emit = require("./../controllers/socket").emit;


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
  } else {
    console.log("Body:",body);
    emit("broadcast", body.source, JSON.stringify(body.payload) );
    res.send(200);
  }
};