import express from 'express'
import { createGiftType, deleteGiftType, updateGiftType, viewGiftType } from '../controllers/gifttype.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.get('/:id', viewGiftType)
router.put('/:id', verifyAdmin, updateGiftType)
router.post('/', verifyAdmin, createGiftType)
router.delete('/:id', verifyAdmin, deleteGiftType)

export default router;