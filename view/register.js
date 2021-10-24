var express=require('express');
var mysql1=require('mysql2');
var mysql=require('../confiq/database');
var router=express.Router();
var nodemailer=require('nodemailer');
const jwt = require("jsonwebtoken");
require('dotenv').config()
var bcrypt=require('bcryptjs');
router.post('/register',(req,res)=>{
    const {fname,lname,email,number,password,conpass,state1,country } = req.body;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!(fname&&lname&&email&&number&&password&&conpass&&state1&&country)) {
        res.status(400).send("All input is required");
      }
      else if(!(filter.test(email)))
      {
          res.send("Invalid mail");
      }
      else
      {
          if(password.length>=8)
          {
              if(password==conpass)
              {
                var s="select * from place where email='"+email+"'";
                mysql.query(s,async(err,result1)=>{
                    if(result1.length==0)
                    {
                        encryptedPassword = await bcrypt.hash(password, 10);
                        var s1="insert into place(first_name,last_name,email,mobile_number,password,state,country) values('"+fname+"','"+lname+"','"+email.toLowerCase()+"','"+number+"','"+encryptedPassword+"','"+state1+"','"+country+"')";
                        mysql.query(s1,(err,result2)=>{
                            if(err) return err;
                            else
                            {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                      user: 'duraimurugan35698@gmail.com',
                                      pass: process.env.PASS
                                    }
                                  });
                                  
                                  var mailOptions = {
                                    from: 'duraimurugan35698@gmail.com',
                                    to: email,
                                    subject: 'Conformation Mail',
                                    text: 'Registration successfull....'
                                  };
                                  
                                  transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  });
                                  const token = jwt.sign(
                                    {  email },
                                    "1234",
                                    {
                                      expiresIn: "2h",
                                    }
                                  );
                                  res.status(201).json(token);
                            }
                        })
                    }
                    else
                    res.send("Already an user");
                })
              }
              else
              res.send("password doen't match");
          }
          else{
              res.send("please enter a Strong Password");
          }
      }
});
module.exports=router;