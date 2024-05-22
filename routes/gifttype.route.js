import express from 'express'
import { createGiftType, deleteGiftType, getAllTypes, updateGiftType, viewGiftType } from '../controllers/gifttype.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router();

router.get('/view/:id', viewGiftType)
router.put('/:id', verifyAdmin, updateGiftType)
router.post('/', verifyAdmin, createGiftType)
router.delete('/:id', verifyAdmin, deleteGiftType)
router.get('/all', getAllTypes)

export default router;