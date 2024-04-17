import express from 'express'
import { verifyUser } from '../utils/UserMiddleware.js';
import { addCommentUser, deleteComment, updateComment, viewComment } from '../controllers/commentuser.controller.js';

const router = express.Router()

router.post("/", verifyUser, addCommentUser)
router.put("/:id", verifyUser, updateComment)
router.delete("/:id", verifyUser, deleteComment)
router.get("/:id", viewComment)

export default router;