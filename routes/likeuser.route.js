import express from 'express'
import { verifyLogin } from '../utils/LoginMiddleware.js';
import { likeUser } from '../controllers/likeuser.controller.js';

const router = express.Router()

router.post("/:id", verifyLogin, likeUser)

export default router;