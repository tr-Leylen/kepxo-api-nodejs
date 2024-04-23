import express from 'express'
import { login, register } from '../controllers/auth.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     description: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login for all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/login', login)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     description: Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Register for new users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/register', register)

export default router