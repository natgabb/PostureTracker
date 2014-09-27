"use strict";

var mongoose = require('mongoose');
var backTrackLocationModel = require('../models/backTrackLocationModel');

module.exports.aggregate = function (rawData) {
  
  var data = JSON.parse(rawData);

  var model = new backTrackLocationModel({
    time: data.time, 
    accels: data.accels
   });

  model.save(function (err, model) {
    if (err) return console.error(err);
  });

};