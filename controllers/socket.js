"use strict";

var dataAnalysis = require('./dataAnalysis');
var chalk = require('chalk');

module.exports = function (io) {
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

      dataAnalysis.aggregate("data is coming");
    });

    socket.on('disconnect', function () {
      console.log(chalk.red("\tdisconnected!") );
    });
  });
};