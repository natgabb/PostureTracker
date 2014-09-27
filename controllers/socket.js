"use strict";

var dataStorage = require('./dataStorage');
var chalk = require('chalk');
var globalSocket;

function emit(event, source, payload) {
  // Emit to rest
  if (globalSocket) {
    globalSocket.sockets.emit(event, {
      payload: payload,
      source: source
    });
  }

  dataStorage.aggregate(payload);
}

function connect(io) {
  globalSocket = io;

  io.on('connection', function (socket) {
    console.log(chalk.green("\tconnection established"));
    socket.on('message', function (from, msg) {

      // Output
      console.log('\t\trecieved message from', chalk.gray(from), 'msg', chalk.gray(JSON.stringify(msg) )); 
      console.log('\t\tbroadcasting message');
      
      // Emit to rest
      emit('broadcast', from, msg);
      console.log('\t\tbroadcast complete');

    });

    socket.on('disconnect', function () {
      console.log(chalk.red("\tdisconnected!") );
    });
  });
  // END Connection
}

module.exports.emit = emit;
module.exports.connect = connect;
