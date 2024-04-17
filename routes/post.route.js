import express from 'express'
import { verifyLogin } from '../utils/LoginMiddleware.js';
import { addPost, deletePost, updatePost, viewPost } from '../controllers/post.controller.js';

const router = express.Router()

router.post("/", verifyLogin, addPost)
router.put("/:id", verifyLogin, updatePost)
router.delete("/:id", verifyLogin, deletePost)
router.get("/:id", viewPost)

export default router;