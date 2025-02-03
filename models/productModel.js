const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:String,
        required:true
    },
    isWish:{
        type:Boolean,
        required:true,
        default:false
    },
    isCart:{
        type:Boolean,
        required:true,
        default:false
    }

});

module.exports = mongoose.model('pdt',productSchema);