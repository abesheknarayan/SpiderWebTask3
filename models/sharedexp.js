var mongoose=require("mongoose");

var sharedSchema= new mongoose.Schema({
    payid:String,
    oweid:String,
    title:String,
    content:String,
    bill:Number,
    lent:Number,
    millidate:Number,
    billdate:String
});
module.exports=mongoose.model("sharedexp",sharedSchema);