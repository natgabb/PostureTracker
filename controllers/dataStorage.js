"use strict";

var mongoose = require('mongoose');
var backTrackLocationModel = require('../models/backTrackLocationModel');

module.exports.aggregate = function (data) {
  
  ///todo: data validation

  var model = new backTrackLocationModel(data);

  model.save(function (err, model) {
    if (err) return console.error(err);
  });

};