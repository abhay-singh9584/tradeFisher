var express = require('express');
var router = express.Router();
const bycrypt=require('bcryptjs')
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const session=require('express-session')

mongoose.connect('mongodb+srv://Anil:Anil8518@tradefisher.0rudn2r.mongodb.net/?retryWrites=true&w=majority')

var userSchema=mongoose.Schema({
  number:{
    type:String,
  },

  name:{
    type:String
  },

  email:{
    type:String
  },

  tokens:[{
    token:{
        type:String
    }
  }],

})

userSchema.methods.getAuthToken= async function(){
    try {
        const token=jwt.sign({_id:this.id},'mynameisabhaypratapsinghas763829@gmail.com')
        
        this.tokens=this.tokens.concat({token})
        console.log('token from schema',token)
        return token
    } catch (error) {
        console.log('Error',error);
    }
}

userSchema.methods.checkAuthToken= async function(){
    try {
        // console.log(this.tokens[0].token);
        const token=jwt.verify(this.tokens[0].token,'mynameisabhaypratapsinghas763829@gmail.com')
        if(token){
            console.log('token verified')
        }
        else{
            console.log('no user exists')
        }
        return token
    } catch (error) {
        console.log("error from login_user",error)
    }
}

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        // console.log('here here')
        this.password=await bycrypt.hash(this.password,10)
    }
    next()
})


// const Register=new mongoose.model('register',userSchema);

module.exports=new mongoose.model('user',userSchema);