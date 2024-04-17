import express from 'express'
import { deleteNotification } from '../controllers/notification.controller.js';
import { verifyLogin } from '../utils/LoginMiddleware.js';

const router = express.Router()

router.delete("/:id", verifyLogin, deleteNotification)

export default router;