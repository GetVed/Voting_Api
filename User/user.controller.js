import bcrypt from 'bcrypt'
import { User } from './user.schema.js'
import { generateTokenAndGetCookie } from '../utils/generateTokenAndGetCookie.js'
export const signup = async(req,res)=>{
    try {
      
        const data = req.body
        const adminUser = await User.findOne({role:'admin'})
        if(data.role==='admin' && adminUser){
            return res.status(400).json({ error: 'Admin user already exists' });
        }
         
        if(!/^\d{12}$/.test(data.aadharNumber)){
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }
        const userExist = await User.findOne({aadharNumber:data.aadharNumber})
        if(userExist){
            return  res.status(400).json({success:false ,error:"User already exists ..." })
        }
        const hashedPassword=await bcrypt.hash(data.password,10)
        const userData={
            ...data,
            password:hashedPassword
        }
        const user= new User(userData)
        await user.save()
        res.status(201).json({success:true , error:false , message:"User Created." ,user:{...user._doc , password:undefined}})
    } catch (error) {
        res.status(400).json({success:false ,error:error.message })
    }
}

export const login = async(req,res)=>{
    try{
      const {aadharNumber,password}=req.body
      if(!aadharNumber || !password){
        return  res.status(400).json({success:false ,error:"Aadhar Card Number and password are required" })
      }
      const user=await User.findOne({aadharNumber})
      if(!user){
        return  res.status(400).json({success:false ,error:"User not found..." })
      }
      const isPassword = await bcrypt.compare(password,user.password)
      if(!isPassword){
        return  res.status(400).json({success:false ,error:"Incorrect Password..." })
      }
      const token=generateTokenAndGetCookie(res,user._id)
     res.status(200).json({success:true ,error:false , message:"Login Successfully..." ,token:token })
    }catch(error){
        res.status(400).json({success:false ,error:error.message })
    }
}

export const profile = async(req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId)
       res.status(200).json({success:true , error:false , user:{...user._doc,password:undefined}})
    } catch (error) {
        res.status(400).json({success:false ,error:error.message }) 
    }
}

export const updatePassword = async(req,res)=>{
    try {
       const {newPassword,currentPassword}=req.body 
       const userId = req.userId
       if(!newPassword || !currentPassword){
        return res.status(400).json({success:false , error:"Both currentPassword and newPassword required."})
       }
       const user = await User.findById(userId)
       if(!user){
        return res.status(400).json({success:false , error:"User not found..."})
       }
       const isPassword=await bcrypt.compare(currentPassword,user.password)
       if(!isPassword){
        return res.status(400).json({success:false , error:"Invalid current password"})
       }
       const hashedPassword=await bcrypt.hash(newPassword,10)
       user.password=hashedPassword
       await user.save()

       res.status(200).json({success:true , error:false , message:"Password Updated."})
    } catch (error) {
        res.status(400).json({success:false ,error:error.message }) 
    }
}

export const logout = async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true , error:false , message:"Logout Successfully..."})
}

