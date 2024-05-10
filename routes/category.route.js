import express from 'express'
import { verifyAdmin } from '../utils/AdminMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js';

const router = express.Router()

router.post('/', verifyAdmin, createCategory)
router.put('/:id', verifyAdmin, updateCategory)
router.delete('/:id', verifyAdmin, deleteCategory)
router.get('/', getCategories)
router.get('/view/:id', getCategory)

export default router;