import express from 'express'
import { verifyAdmin } from '../utils/AdminMiddleware.js';
import { createConference, deleteConference, getAllConferences, getConference, updateConference } from '../controllers/conference.controller.js';

const router = express.Router()

router.post("/create", verifyAdmin, createConference)
router.put("/update/:id", verifyAdmin, updateConference)
router.get("/view/:id", getConference)
router.get("/all", getAllConferences)
router.delete("/:id", verifyAdmin, deleteConference)

export default router;