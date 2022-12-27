const userModel=require('./users')
module.exports={
    getUserData: async (req,res)=>{

        const User =await req.session.user;
    
        if(User){
            const userData=await userModel.findOne({username:User}).select({ _id: 1, username: 1, email: 1, name: 1})
            if(userData){
                return userData
            }
        }
        res.send('Login first')
    },
    
    isLoggedIn : (req,res,next)=>{
        if(req.session.user){
            next()
        }
        else{
            res.redirect('/')
        }
    },
}