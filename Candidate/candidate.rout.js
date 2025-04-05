import express from 'express'
import { addCandidate, updateCandidate ,deleteCandidate} from './candidate.controller.js';
import { jwtAuth } from '../middleware/jwt.middleware.js';

const CandidateRouter=express.Router()

CandidateRouter.post('/',jwtAuth,addCandidate)
CandidateRouter.put('/:candidateId',jwtAuth,updateCandidate)
CandidateRouter.delete('/:candidateId',jwtAuth,deleteCandidate)
export default CandidateRouter;