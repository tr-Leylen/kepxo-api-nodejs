import e from "express";
import { verifyUser } from "../utils/UserMiddleware.js";
import { userJoin } from "../controllers/joinconference.controller.js";

const router = e.Router()

router.post("/join/:id", verifyUser, userJoin)

export default router;