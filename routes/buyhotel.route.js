import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { buyHotel, deleteBuyHotel } from '../controllers/buyhotel.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.post("/:id", verifyUser, buyHotel)
router.delete("/:id", verifyAdmin, deleteBuyHotel)

export default router;