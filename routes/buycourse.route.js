import express from 'express'
import { buyCourse, deleteBuyCourse } from '../controllers/buycourse.controller.js';

const router = express.Router()

router.post("/buy", buyCourse)
router.delete("/delete/:id", deleteBuyCourse)

export default router;