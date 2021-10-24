var express=require('express');
var app=express();
var mysql=require('./confiq/database');
const jwt = require("jsonwebtoken");
var bodyParser=require('body-parser');
var auth=require('./middleware/auth')
var bcrypt=require('bcryptjs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var reg=require('./view/register');
var lo=require('./view/login');

app.post('/register',reg);
app.post('/login',lo);
app.post('/profile',auth,(req,res)=>{
    var {email}=req.query;
    var s="select * from place where email='"+email+"'";
    mysql.query(s,(err,result)=>{
        if(err) return err;
        else
        res.send(result);
    });
});

app.listen(1234,console.log("Server Have Been Statrted..."));