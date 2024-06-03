import express from 'express'
import { deleteStar, getStar, setStar, updateStar } from '../controllers/starcourse.controller.js';
import { verifyUser } from '../utils/UserMiddleware.js';

const router = express.Router()

router.get('/view/:id', getStar)
router.post('/create', verifyUser, setStar)
router.put('/update/:id', verifyUser, updateStar)
router.delete('/delete/:id', verifyUser, deleteStar)

export default router;