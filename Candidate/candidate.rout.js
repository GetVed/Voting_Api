import express from 'express'
import { addCandidate, updateCandidate ,deleteCandidate,addVoter, voteCount, candidateList} from './candidate.controller.js';
import { jwtAuth } from '../middleware/jwt.middleware.js';

const CandidateRouter=express.Router()

CandidateRouter.post('/',jwtAuth,addCandidate)
CandidateRouter.put('/:candidateId',jwtAuth,updateCandidate)
CandidateRouter.delete('/:candidateId',jwtAuth,deleteCandidate)
CandidateRouter.get('/vote/count',voteCount)
CandidateRouter.get('/vote/:candidateId',jwtAuth,addVoter)
CandidateRouter.get('/',candidateList)
export default CandidateRouter;