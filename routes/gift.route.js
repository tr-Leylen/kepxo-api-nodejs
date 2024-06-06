import express from 'express'
import { createGift, deleteGift, getAllGifts, searchGift, updateGift, viewGift } from '../controllers/gift.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.get("/view/:id", viewGift)
router.post("/create", verifyAdmin, createGift)
router.put("/:id", verifyAdmin, updateGift)
router.delete("/:id", verifyAdmin, deleteGift)
router.get("/all", getAllGifts)
router.get("/search?:title", searchGift)

export default router;