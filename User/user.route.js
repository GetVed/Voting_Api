import express from 'express'
import { login, logout, profile, signup, updatePassword } from './user.controller.js';
import { jwtAuth } from '../middleware/jwt.middleware.js';

const UserRouter = express.Router()

UserRouter.post('/signup',signup)
UserRouter.post('/login',login)
UserRouter.get('/profile',jwtAuth,profile)
UserRouter.put('/profile/password',jwtAuth,updatePassword)
UserRouter.post('/logout',logout)

export default UserRouter;