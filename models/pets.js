/*Mandatory Attributes for petModel */
const mongoose = require('mongoose');

const {Schema,model}=mongoose
const petModel = Schema({
    name:{
      type:String,
      required:true
    },
    age:{
      type:Number,
      required:true
    },
    color:{
      type:String,
      required:true
    }
  });
  module.exports = model('Pets', petModel);