var mongoose=require("mongoose");
var passportlocalmangoose=require("passport-local-mongoose");


var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    
    totalexpense:Number,
    paidBill:Number,
    oweothers:Number,
    payyou:Number,
    splitbalance:Number
   
    
});
userSchema.plugin(passportlocalmangoose);
module.exports= mongoose.model("user",userSchema);
