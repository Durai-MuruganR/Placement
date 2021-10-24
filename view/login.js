var express=require('express');
var mysql1=require('mysql2');
var mysql=require('../confiq/database');
var router=express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()
var bcrypt=require('bcryptjs');
router.post('/login',(req,res)=>{
    const { email, password } = req.body;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!(email&&password)) {
        res.status(400).send("All input is required");
      }
      else if(!(filter.test(email)))
      {
          res.send("Invalid email");
      }
      else{
        var s="select * from place where email='"+email+"'";
        mysql.query(s,async(err,res1)=>{
            if(res1.length==1)
            {
                if (await bcrypt.compare(password, res1[0].password)) {
                    // Create token
                    const token = jwt.sign(
                      {  email },
                      "1234",
                      {
                        expiresIn: "2h",
                      }
                      
                    );
                    res.send(token);
                }
                else
                res.send("Invalid Credientials");
            }
            else
            {
                res.send("please Register");
            }
        });
      }
});
module.exports=router;