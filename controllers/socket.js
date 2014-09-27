"use strict";

var dataAnalysis = require('./dataAnalysis');
dataAnalysis.aggregate("data is coming");

module.exports = function (io) {
  io.on('connection', function (socket) {
    
    console.log('something connected ' + socket);
    
    socket.on('message', function (from, msg) {
      
      console.log('...recieved message from', from, 'msg', JSON.stringify(msg));
      console.log('broadcasting message');
      console.log('payload is', msg);

      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });


      
      console.log('broadcast complete');
    });

    socket.on('disconnect', function() { console.puts("Client has disconnected"); }) ;
  });
};