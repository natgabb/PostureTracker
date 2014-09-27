"use strict";

var mongoose = require("mongoose");
var backTrackLocationSchema = mongoose.Schema({
	time: 	Date,
  	accels: [{x: Number, y: Number, z: Number}]
});

// instanceSchema.statics.customFunctionName = function() {
// }

module.exports = mongoose.model("backTrackLocationModel", backTrackLocationSchema, "backTrackLocationModel");