import express from 'express'
import './env.js'
import UserRouter from './User/user.route.js'
import connectToDb from './config/db.js'
import cookieParser from 'cookie-parser'
import CandidateRouter from './Candidate/candidate.rout.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/users',UserRouter)
app.use('/api/candidates',CandidateRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
    connectToDb()
})