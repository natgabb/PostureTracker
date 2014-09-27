"use strict";

var dataStorage = require('./dataStorage');
var chalk = require('chalk');
var globalSocket;

module.exports.connect = function (io) {
  globalSocket = io;

  // Connection
  io.on('connection', function (socket) {
    console.log(chalk.green("\tconnection established"));
    socket.on('message', function (from, msg) {

      // Output
      console.log('\t\trecieved message from', chalk.gray(from), 'msg', chalk.gray(JSON.stringify(msg) )); 
      console.log('\t\tbroadcasting message');
      
      // Emit to rest
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
      console.log('\t\tbroadcast complete');

      var fakeData = { timestamp:new Date,
                       sensor1:{x:1.0, y:2.0, z:3.0}, 
                       sensor2:{x:1.0, y:2.0, z:3.0},
                       sensor3:{x:1.0, y:2.0, z:3.0},
                       sensor4:{x:1.0, y:2.0, z:3.0}};
      
      dataStorage.aggregate(fakeData);
    });

    socket.on('disconnect', function () {
      console.log(chalk.red("\tdisconnected!") );
    });
  });
  // END Connection
};

module.exports.socket = function() {
  var toReturn;
  if (globalSocket) {
    toReturn = globalSocket;
  }
  return toReturn;
};