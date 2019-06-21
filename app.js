var express=require("express");
var app=express();
var port=3000;
var date;
var date2;
var splitbalance1=0;
var splitbalance2=0;
var splitbalance11=0;
var splitbalance22=0;
var totalexpense1=0;
var billpaid=0;
var owedexpense=0;
var otherspayyou=0;
var otherspayyou2=0;
var choice=1;
var choice2=1;
var localStrategy=require("passport-local");
var passport=require("passport");
var passportmongoose=require("passport-local-mongoose");
var mongoose=require("mongoose");
var user=require("./models/users");
var expenses=require("./models/expenses");
var sharedexp=require("./models/sharedexp");
mongoose.connect('mongodb://localhost:27017/Wallet',(
    {useNewUrlParser: true,
     useCreateIndex:true  
    }
));
var bodyParser=require("body-parser");
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(require("express-session")({
    secret:"I am the best coder in the world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/",function(req,res){
res.render("home");
});


app.get("/login",function(req,res)
{
res.render("login");







});

app.get("/register",function(req,res)
{
    res.render("register");
}
);
app.get("/user",isLoggedIn,function(req,res)
{  if(choice==1)
    {
    expenses.find({userid:req.user.id}).sort({expense:-1}).exec(function(err,exp)
    {
        if(err)
        {
            console.log(err);
        }
        else{
        
        res.render("info",
        {
            user:req.user,
            expenses:exp});
            console.log(exp);

          totalexpense1=parseInt(req.user.totalexpense);
          billpaid=parseInt(req.user.paidBill);
          
          otherspayyou=parseInt(req.user.payyou);
          splitbalance1=parseInt(req.user.splitbalance);
        } 
    })}
    else if(choice==2)
    {
        expenses.find({userid:req.user.id}).sort({expense:1}).exec(function(err,exp)
    {
        if(err)
        {
            console.log(err);
        }
        else{
        
        res.render("info",
        {
            user:req.user,
            expenses:exp});
         
          totalexpense1=parseInt(req.user.totalexpense);
          billpaid=parseInt(req.user.paidBill);
          
          otherspayyou=parseInt(req.user.payyou);
          splitbalance1=parseInt(req.user.splitbalance);
        } 
    })
    }
    if(choice==3)
    {
        expenses.find({userid:req.user.id}).sort({millidate:-1}).exec(function(err,exp)
        {
            if(err)
            {
                console.log(err);
            }
            else{
            
            res.render("info",
            {
                user:req.user,
                expenses:exp});
    
              totalexpense1=parseInt(req.user.totalexpense);
              billpaid=parseInt(req.user.paidBill);
              
              otherspayyou=parseInt(req.user.payyou);
              splitbalance1=parseInt(req.user.splitbalance);
            } 
        })   

    }
    else if(choice==4)
    {
        expenses.find({userid:req.user.id}).sort({millidate:1}).exec(function(err,exp)
        {
            if(err)
            {
                console.log(err);
            }
            else{
            
    res.render("info",
    {
        user:req.user,
        expenses:exp});

      totalexpense1=parseInt(req.user.totalexpense);
      billpaid=parseInt(req.user.paidBill);
      
      otherspayyou=parseInt(req.user.payyou);
      splitbalance1=parseInt(req.user.splitbalance);
    

            
        }})   
   
    }
    
});



app.post("/register",function(req,res)
{
  req.body.username
  req.body.password
  
  user.register(new user(
      {
          username:req.body.username,
          splitbalance:0,
          totalexpense:0,
          paidBill:0,
          oweothers:0,
          payyou:0

        }
          ),req.body.password,function(err,user)
  {
      if(err)
      
      {
          console.log(err);
          res.redirect("/register");
      }
      passport.authenticate("local")(req,res,function()
      {
          
         
          res.redirect("/user");
          
        //   console.log(user);
      });

  });
});



app.post("/expense/delete/:id",function(req,res)
{
    console.log(req.params);
    expenses.findById(req.params.id,function(err,exp)
    {
        if(err)
        {
            console.log(err);
        }
        else{
        
           
           
           totalexpense1=totalexpense1-parseInt(exp.expense);
         
            user.findByIdAndUpdate(exp.userid,{
                
                totalexpense:totalexpense1
            },function(err,user)
            {
                if(err)
                {
                    console.log(err);
                }
                else{

                }
            })
        }
    });
    expenses.findByIdAndDelete(req.params.id,function(err,deleted)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(deleted);
            res.redirect("/user");
        }
    })
    
});

app.get("/user/addpersonalexp",isLoggedIn,function(req,res)
{
    console.log(req.user);
    res.render("addpersonalexp",{
       
    
    });
    
});
app.get("/user/splitwise",isLoggedIn,function(req,res)
{   
       user.findById(req.user.id,function(err,loggeduser)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        if(choice2==1)  
                        {
                        sharedexp.find({payid:req.user.username}).sort({lent:-1}).exec(function(err,owerslist)
                        {
                             if(err)
                             {
                                 console.log(err);
                             }
                             else{
                                sharedexp.find({oweid:req.user.username}).sort({lent:-1}).exec(function(err,payerlist)
                                {
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else{
                                        res.render("splitwise",{
                                            user:loggeduser,
                                            payers:payerlist,
                                            owers:owerslist
                                           });    
                                    }
                                  
                                });
                                    
                             }
                             
                        })
                    
                        }
                        if(choice2==2)  
                        {
                        sharedexp.find({payid:req.user.username}).sort({lent:1}).exec(function(err,owerslist)
                        {
                             if(err)
                             {
                                 console.log(err);
                             }
                             else{
                                sharedexp.find({oweid:req.user.username}).sort({lent:1}).exec(function(err,payerlist)
                                {
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else{
                                        res.render("splitwise",{
                                            user:loggeduser,
                                            payers:payerlist,
                                            owers:owerslist
                                           });    
                                    }
                                  
                                });
                                    
                             }
                             
                        })
                    
                        }
                        if(choice2==3)  
                        {
                        sharedexp.find({payid:req.user.username}).sort({millidate:-1}).exec(function(err,owerslist)
                        {
                             if(err)
                             {
                                 console.log(err);
                             }
                             else{
                                sharedexp.find({oweid:req.user.username}).sort({millidate:-1}).exec(function(err,payerlist)
                                {
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else{
                                        res.render("splitwise",{
                                            user:loggeduser,
                                            payers:payerlist,
                                            owers:owerslist
                                           });    
                                    }
                                  
                                });
                                    
                             }
                             
                        })
                    
                        }
                        if(choice2==4)  
                        {
                        sharedexp.find({payid:req.user.username}).sort({millidate:1}).exec(function(err,owerslist)
                        {
                             if(err)
                             {
                                 console.log(err);
                             }
                             else{
                                sharedexp.find({oweid:req.user.username}).sort({millidate:1}).exec(function(err,payerlist)
                                {
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else{
                                        res.render("splitwise",{
                                            user:loggeduser,
                                            payers:payerlist,
                                            owers:owerslist
                                           });    
                                    }
                                  
                                });
                                    
                             }
                             
                        })
                    
                        }
                    }
                
                
        
}) 
});   

app.post("/expense/sort/:id",function(req,res)
{
    choice=parseInt(req.params.id);
    res.redirect("/user");
})
app.post("/sharedexpense/sort/:id",function(req,res)
{
    choice2=parseInt(req.params.id);
    res.redirect("/user/splitwise");
})


app.get("/user/addsharedexp",isLoggedIn,function(req,res)
{   

        user.find({username:{$ne:req.user.username}},function(err,user)
        { 
            if(err)
            {
                console.log(err);
            }
            else{
               user.forEach(function(u)
               {
                   console.log(u.username);
               })
                res.render("addsharedexp",{users:user});
            }
            
        }
        )
       
    });



app.post("/user/addsharedexp",function(req,res)
{
   console.log(typeof req.user.username);
   date=Date.now();
   date2= Date().slice(3,24);
 
   sharedexp.create({
       payid:req.user.username,
       oweid:req.body.owid,
       title:req.body.title,
       content:req.body.content,
       bill:req.body.bill,
       lent:req.body.lent,
       millidate:date,
       billdate:date2
     

   },function(err,sharedexpense)
   {
        if(err)
        {
            console.log(err);
        }
        else{
           
            user.findOne({
                username:req.body.owid
            },function(err,ower0)
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    splitbalance2=ower0.splitbalance;
                    owedexpense=ower0.oweothers;
                    console.log(splitbalance2);
                   billpaid=parseInt(billpaid)+parseInt(req.body.bill);
                  owedexpense=parseInt(owedexpense)+parseInt(req.body.lent);
                  splitbalance1=parseInt(splitbalance1)+parseInt(req.body.lent);
                  splitbalance2=parseInt(splitbalance2)-parseInt(req.body.lent);
                  console.log(splitbalance2);
                  otherspayyou=parseInt(otherspayyou)+parseInt(req.body.lent);
                  user.findOneAndUpdate({
                    username:req.user.username
                },{
                   paidBill:billpaid,
                   splitbalance:splitbalance1,
                   payyou:otherspayyou
                },function(err,paiduser){
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                         
    
                        
                        user.findOneAndUpdate({
                            username:req.body.owid
                        },{
                            oweothers:owedexpense,
                            splitbalance:splitbalance2
                        },function(err,oweuser)
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                
                                res.redirect("/user");
                            }
                        })
                    }
                }) 
                }
            })
           
           
            
           
        }
   });
  
    
});
app.post("/share/settle/:id",function(req,res)
{
    console.log(req.params);
    sharedexp.findByIdAndDelete(req.params.id,function(err,settle)
    {
      if(err)
      {
          console.log(err);
      }
      else{
          console.log(settle);
          user.findOne({username:settle.payid},function(err,lender)
          {
              if(err)
              {
                  console.log(err);
              }
              else{
                  splitbalance11=parseInt(req.user.splitbalance);
                  splitbalance22=parseInt(lender.splitbalance);
                  otherspayyou2=parseInt(lender.payyou);
                  owedexpense=parseInt(req.user.oweothers);
                splitbalance11=parseInt(splitbalance11)+parseInt(settle.lent);
                splitbalance22=parseInt(splitbalance22)-parseInt(settle.lent);
                otherspayyou2=parseInt(otherspayyou2)-parseInt(settle.lent);
                owedexpense=parseInt(owedexpense)-parseInt(settle.lent);
                user.findOneAndUpdate({username:settle.payid},{
                   splitbalance:splitbalance22,
                  payyou:otherspayyou2
                },function(err,payer)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        user.findOneAndUpdate({username:settle.oweid},{
                            splitbalance:splitbalance11,
      
                            oweothers:owedexpense
                        },function(err,ower)
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                //   res.redirect("/user/splitwise");          
                            }
                        })
                    }
                })
              }
          })
         
      }
    })
    

})

 app.post("/user/addpersonalexp",function(req,res)
 {
    date=Date.now();
    date2= Date().slice(3,24);
   
    
       expenses.create({
         userid:req.user.id,
         title:req.body.title,
         content:req.body.content,
         expense:req.body.expense,
         millidate:date,
         billdate:date2
         
     }
     
     ,function(err,exp)
     {
         if(err)
         {
            console.log(err);
         }
         else{
                //  totalexpense=parseInt(totalexpense)+parseInt(exp.expense);
            totalexpense1=parseInt(totalexpense1)+parseInt(exp.expense);
            // console.log(totalexpense);
            
            

            user.findByIdAndUpdate(req.user.id,{
         
                totalexpense:totalexpense1,
                
            },function(err,user)
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    
                    res.redirect("/user"); 
                }
            })
       
         }
     });
    
     
    //  console.log(req.user.id);
    
       
     });




  app.post("/login",passport.authenticate("local",
  {
      successRedirect:"/user",
      failureRedirect:"/login"
  }),function(err,user)
{
if(err)
{
    console.log(err);

}
else
{
  
}
});


function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else{

    res.redirect("/login");
}
}


app.get("/logout",function(req,res)
{
    req.logout();
     
    res.redirect("/");
});

app.listen(port,function()

{
console.log("port 3000 running");
});
