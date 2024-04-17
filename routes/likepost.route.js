import express from 'express'
import { verifyLogin } from '../utils/LoginMiddleware.js';
import { likePost } from '../controllers/likepost.controller.js';

const router = express.Router()

router.post("/:id", verifyLogin, likePost)

export default router;