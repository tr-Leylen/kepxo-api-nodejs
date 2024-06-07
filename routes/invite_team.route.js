import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { acceptInvite, deleteInvite, sendInvite, userInviteList } from '../controllers/invite_team.controller.js';

const router = express.Router()

router.post('/send/:id', verifyUser, sendInvite)
router.post('/accept/:id', verifyUser, acceptInvite)
router.get('/list', verifyUser, userInviteList)
router.delete('/delete/:id', verifyUser, deleteInvite)

export default router;