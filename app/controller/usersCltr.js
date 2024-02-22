

const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
const _ = require('lodash')
const jwt=require('jsonwebtoken')
const { validationResult } = require('express-validator')
const usersCltr = {}

usersCltr.register=async(req,res)=>{
    const errors=validationResult(req)  
    // res.send('register welcomes')
    if( !errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
     }else{ 
        const body = _.pick(req.body, ["username", 'email', 'mobileNumber', 'password', "role"])
        try{
            const user = new User(body) 
            console.log(user)
            const salt= await bcrypt.genSalt() 
            const encrptedpassword= await bcrypt.hash(user.password,salt)
            user.password=encrptedpassword
           const length= await User.countDocuments()
           if(length==0){
            user.role="admin"
           }
           await user.save()
           res.status(201).json(user) 
          }
          catch(e){
           res.status(500).json(e)
        }
     }          
}

usersCltr.login=async(req,res)=>{
    const errors=validationResult(req)  
    if( !errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
     }
     const body = _.pick(req.body, ['email', 'password']) 
     console.log(body)
     try{
        const user = await User.findOne({ email: body.email })
        
        if(!user) {
            return res.status(404).json({ errors : [ { msg : 'invalid email/password' } ] })
        }

        const result = await bcrypt.compare( body.password, user.password) 
         
        if(!result) {
            return res.status(404).json({ errors : [ { msg : 'invalid email/password' } ] })
        }

        const tokenData = { id : user._id , role : user.role }
        
        // const token = jwt.sign(tokenData, process.env.JWT_SECRET , { expiresIn: '14d'})
        const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'14d'})
        
        // res.json(token)
        res.status(200).json({ token: token })

     }catch(e){
        res.status(500).json(e)
    
     }
}

usersCltr.profile=async(req,res)=>{
       try{
        const account = await User.findById(req.user.id)
        // console.log(account)
       const body= _.pick(account,['_id','username','email','role','mobileNumber']) //option
         res.json(body)
       }catch(e){
        res.status(500).json(e)
       }
 }

usersCltr.editProfile=async(req,res)=>{
      console.log('edit account')
      const id=req.user.id
     
      const body = _.pick(req.body, ["username", "mobileNumber",'email'])
      console.log(body)
      const errors=validationResult(req)
     
           console.log('validation')
                if(!errors.isEmpty()){
                    console.log('error')
              return res.status(400).json({errors:errors.array()})
            }

    try{
        const updatedProfile = await User.findByIdAndUpdate(id, body, {
            new: true,
          });
          // console.log(updatedProfile)
          const userData = _.pick(updatedProfile, [
            "_id",
            "username",
            "email",
            "mobileNumber",
            "role"
          ])
          res.json(userData)

    }catch(e){
        res.status(500).json(e.message);
    }
}

usersCltr.list=async(req,res)=>{
    console.log('api is working')
    try {
        const users = await User.find()
        res.json(users)
      } catch (e) {
        res.status(404).json(e)
      }
}

usersCltr.search = async (req, res) => {
    try {
      const id = req.params.id
      const foundUser = await User.findById(id)
      res.json(foundUser)
    } catch (e) {
      res.status(404).json(e)
    }
  }

// module.exports=usersCltr
module.exports=usersCltr