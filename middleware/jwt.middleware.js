import jwt from 'jsonwebtoken'

export const jwtAuth=(req,res,next)=>{
    const token = req.cookies.token || req.headers['authorization']

    if(!token){
        return  res.status(400).json({success:false ,error:"Unauthorized - No Token provided." })
    }

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        if(!payload){
            return  res.status(400).json({success:false ,error:"Unauthorized - Invalid Token" })  
        }
        req.userId=payload.userId
        next()
    } catch (error) {
        return  res.status(400).json({success:false ,error:error.message })
    }
}