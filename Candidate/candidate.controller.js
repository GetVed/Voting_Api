import { User } from "../User/user.schema.js"
import { Candidate } from "./candidate.schema.js"

const checkAdmin=async (userId)=>{
   try{
      const user=await User.findById(userId)
      if(user.role==='admin'){
        return true
      }
   }catch(err){
    return false
   }
}

export const addCandidate=async(req,res)=>{
    try{
      const userId = req.userId
      const data = req.body
      if(!(await checkAdmin(userId))){
        return res.status(403).json({success:false , error:"User does not have admin role."})
      }
         const candidate = new Candidate(data)
         await candidate.save()
         res.status(200).json({success:true , message:"Candidate Created" , response:candidate})
    }catch(err){
        res.status(500).json({success:false , error:"Internal Server Error."})
    }
}

export const updateCandidate=async(req,res)=>{
    try {
        const userId=req.userId
        const candidateId=req.params.candidateId
        const updateCandidateData=req.body

        if(!(await checkAdmin(userId))){
            return res.status(403).json({success:false , error:"User does not have admin role."})
        }

        const response = await Candidate.findOneAndUpdate(candidateId,updateCandidateData,{
            new:true,
            runValidators:true
        })

        if(!response){
            return res.status(404).json({success:false , error:"Candidate not found..."})
        }

        res.status(201).json({success:true , error:false , message:"Candidate Updated." , response})
    } catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error."})
    }
}

export const deleteCandidate=async(req,res)=>{
    try{
       const userId = req.userId
       const candidateId = req.params.candidateId

       if(!(await checkAdmin(userId))){
        return res.status(403).json({success:false , error:"User does not have admin role."})
       }

       const response = await Candidate.findByIdAndDelete(candidateId)

       if(!response){
        return res.status(404).json({success:false , error:"Candidate not found..."})
    }
       res.status(200).json({success:true , error:false , message:"Candidate Deleted." , response})
    }catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error."})
    }
}