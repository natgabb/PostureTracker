"use strict";

var mongoose = require("mongoose");
var instanceSchema = mongoose.Schema({
  
});

instanceSchema.statics.customFunctionName = function() {

}

module.exports = mongoose.model("instanceModel", instanceSchema, "instanceModel");