import express from 'express'
import { verifyAdmin } from '../utils/AdminMiddleware.js';
import { createCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';

const router = express.Router()

router.post('/', verifyAdmin, createCategory)
router.put('/:id', verifyAdmin, updateCategory)
router.delete('/:id', verifyAdmin, deleteCategory)

export default router;