import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { buyGift, deleteBuyGift } from '../controllers/buygift.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.post("/:id", verifyUser, buyGift)
router.delete("/:id", verifyAdmin, deleteBuyGift)

export default router;