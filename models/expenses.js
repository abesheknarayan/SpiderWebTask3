var mongoose=require("mongoose");
var passportlocalmangoose=require("passport-local-mongoose");
var expensesSchema=new mongoose.Schema({
    userid:String,
    title:String,
    content:String,
    expense:Number,
    millidate:Number,
    billdate:String
    
});
module.exports=mongoose.model("expenses",expensesSchema);