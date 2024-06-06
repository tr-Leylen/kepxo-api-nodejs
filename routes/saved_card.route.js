import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { createCard, deleteCard, getUserCards, updateCard, viewCard } from '../controllers/saved_card.controller.js';

const router = express.Router()

router.post('/create', verifyUser, createCard)
router.put('/update/:id', verifyUser, updateCard)
router.get('/view/:id', verifyUser, viewCard)
router.get('/all', verifyUser, getUserCards)
router.delete('/delete/:id', verifyUser, deleteCard)

export default router;