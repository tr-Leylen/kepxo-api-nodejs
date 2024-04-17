import express from 'express'
import { createGift, deleteGift, updateGift, viewGift } from '../controllers/gift.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.get("/:id", viewGift)
router.post("/create", verifyAdmin, createGift)
router.put("/:id", verifyAdmin, updateGift)
router.delete("/:id", verifyAdmin, deleteGift)

export default router;