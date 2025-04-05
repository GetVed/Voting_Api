import { User } from "../User/user.schema.js"
import { Candidate } from "./candidate.schema.js"
import { ObjectId } from "mongodb";

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

        const response = await Candidate.findOneAndUpdate({_id:new ObjectId(candidateId)},updateCandidateData,{
            new:true,
            runValidators:true
        })

        if(!response){
            return res.status(404).json({success:false , error:"Candidate not found..."})
        }

        res.status(201).json({success:true , error:false , message:"Candidate Updated." , response})
    } catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error." , message:err.message})
    }
}

export const deleteCandidate=async(req,res)=>{
    try{
       const userId = req.userId
       const candidateId = req.params.candidateId

       if(!(await checkAdmin(userId))){
        return res.status(403).json({success:false , error:"User does not have admin role."})
       }

       const response = await Candidate.findByIdAndDelete({_id:new ObjectId(candidateId)})

       if(!response){
        return res.status(404).json({success:false , error:"Candidate not found..."})
    }
       res.status(200).json({success:true , error:false , message:"Candidate Deleted." , response})
    }catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error."})
    }
}

export const addVoter = async(req,res)=>{
    try {
        const userId=req.userId
        const candidateId=req.params.candidateId
        const candidate = await Candidate.findById({_id:new ObjectId(candidateId)})
        if(!candidate){
            return res.status(404).json({success:false , error:"Candidate not found..."})
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success:false , error:"User not found..."})
        }
        if(user.role==='admin'){
            return res.status(403).json({success:false , error:"Admin not allowed to vote."})
        }
        if(user.isVoted){
            return res.status(400).json({success:false , error:"You already voted..."})
        }

        candidate.votes.push({user:userId})
        candidate.voteCount++
        
        user.isVoted=true
        await user.save()
        await (await candidate.save()).populate('votes.user')
       
        res.status(200).json({success:true , error:false , message:"Vote recorded successfully.",candidate})
    } catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error."})
    }
}

export const voteCount = async(req,res)=>{
    try {
        const candidate = await Candidate.find().sort({voteCount:'desc'})
        const voteRecord = candidate.map((data)=>{
            return {
                party:data.party,
                count:data.voteCount
            }
        })
        return  res.status(200).json({success:true , error:false , voteRecord})
    } catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error." , message:err.message})
    }
}

export const candidateList = async(req,res)=>{
    try {
        const candidates = await Candidate.find({},'name party -_id')
        res.status(200).json(candidates)
    } catch (err) {
        res.status(500).json({success:false , error:"Internal Server Error." , message:err.message}) 
    }
}