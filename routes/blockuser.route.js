import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { blockUser } from '../controllers/blockuser.controller.js';

const router = express.Router()

router.post('/:id', verifyUser, blockUser)

export default router;