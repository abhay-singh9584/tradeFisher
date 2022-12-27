const express = require('express');
const router = express.Router();
const userModel=require('./users')
const Joi = require('joi')
const {isLoggedIn,getUserData}=require('./middleware')
const passport = require('passport');
const {v4:uuidv4}=require('uuid')
var userProfile;
// mailer()


router.get('/',async(req,res)=>{
    res.render('index')
})

router.post('/register',async (req,res)=>{
    try{
        const userObj={
            number : Joi.string().required(),
            email:Joi.string().email().optional().allow(''),
            name:Joi.string().optional().allow(''),
        }
        const schema = Joi.object(userObj);
        const { error } = schema.validate(req.body);

        if(error){
            return res.status(400).send(error.details[0].message)
        }

        var newUser = new userModel({
            number : req.body.number,
            email:req.body.email,
            name:req.body.name,
        })

        const userFind=await userModel.find({number:req.body.number})
        // const emailFind=await userModel.find({email:req.body.email})

        // console.log(userFind)
        if(userFind==null || userFind.length>0){
            return res.send("number Already Exists")
        }
        // else if(emailFind==null || emailFind.length>0){
        //     return res.send("Email Already Exists")
        // }

        const token=await newUser.getAuthToken()
        // app.use(session({token:token,secret:'mynameisabhaypratapsinghas763829@gmail.com'}))
        // console.log('token from index',token)

        const registered=await newUser.save()
        if(registered){
            // console.log(registered.number)
            req.session.user=registered.number
            return res.status(200).send('ZR')
        }
        
    }catch(err){
        console.log("error",err)
    }
})

router.get('/users',(req,res)=>{
    userModel.find()
    .then((AllUser)=>{
        res.send(AllUser)
    })
})



module.exports = router;