//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User",userSchema);

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
});

//Register route handlers
app.route("/register")

.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
});

//Login route handlers
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const userName = req.body.username;
  const password = md5(req.body.password);
  User.findOne({email: userName},function(err,foundUser){
    if (err){
      console.log(err);
    }else{
        if (foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
        }
      }
  });
});


app.listen(3000,function(){
  console.log("Sever has started running on port 3000");
});
