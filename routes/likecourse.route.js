import express from 'express'
import { likeCourse } from '../controllers/likecourse.controller.js';
import { verifyLogin } from '../utils/LoginMiddleware.js';

const router = express.Router()

router.post("/:id", verifyLogin, likeCourse)

export default router;