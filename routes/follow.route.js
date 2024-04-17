import express from 'express'
import { followUser } from '../controllers/follow.controller.js';
import { verifyLogin } from '../utils/LoginMiddleware.js';

const router = express.Router()

router.post("/:id", verifyLogin, followUser)

export default router;