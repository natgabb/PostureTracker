"use strict";

var chalk = require('chalk');
var socket;

module.exports.connect = function (io) {
  socket = io;
  io.on('connection', function (socket) {
    console.log(chalk.green("\tconnection established"));
    socket.on('message', function (from, msg) {
 
      console.log('\t\trecieved message from', chalk.gray(from), 'msg', chalk.gray(JSON.stringify(msg) ));
 
      console.log('\t\tbroadcasting message');
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
      console.log('\t\tbroadcast complete');
    });

    socket.on('disconnect', function () {
      console.log(chalk.red("\tdisconnected!") );
    });
  });
};

module.exports.socket = function() {
  var toReturn;
  if (socket) {
    toReturn = socket;
  }
  return toReturn;
};