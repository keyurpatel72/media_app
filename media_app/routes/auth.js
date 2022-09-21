const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const bcrypt = require('bcrypt');

//register
//http://localhost:8000/api/auth/register
router.post('/register',async(req,res)=>{
 try {
    //genrate salt hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password,salt);
    // create add new user
    const newUser =new User({
        username:req.body.username,
        email:req.body.email,
        password:hashpassword
    
     });
     // save user and resposne
    const user = await newUser.save();
    res.status(200).json(user);
 } catch (error) {
    console.log(error);
    res.status(500).json(error);
 }
});
//login
//http://localhost:8000/api/auth/login
router.post('/login',async(req,res)=>{
    try {
        //check email
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found");
       //check password
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("wrong password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports =router;