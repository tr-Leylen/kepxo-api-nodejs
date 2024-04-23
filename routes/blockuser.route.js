import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { blockUser } from '../controllers/blockuser.controller.js';

const router = express.Router()

router.post('/:id', verifyUser, blockUser)
/**
 * @swagger
 * /api/blockuser/{userId} :
 *   post:
 *     summary: Block user
 *     tags: [User Block]
 *     description: Block user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID parameter in the path
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your_access_token_here
 *           description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: User blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

export default router;