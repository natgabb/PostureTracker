"use strict";

var mongoose = require("mongoose");
var backTrackLocationSchema = mongoose.Schema({
	timestamp: Date,
  	sensor1: {x: Number, y: Number, z: Number},
  	sensor2: {x: Number, y: Number, z: Number},
  	sensor3: {x: Number, y: Number, z: Number},
  	sensor4: {x: Number, y: Number, z: Number}
});

// instanceSchema.statics.customFunctionName = function() {
// }

module.exports = mongoose.model("backTrackLocationModel", backTrackLocationSchema);