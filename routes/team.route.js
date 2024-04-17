import express from 'express'
import { changeMember, changeTeamName, createTeam, getTeam } from '../controllers/team.controller.js'
import { verifyUser } from '../utils/UserMiddleware.js'

const router = express.Router()

router.post("/create", createTeam)
router.get("/:id", getTeam)
router.put("/changemember/:id", verifyUser, changeMember)
router.put("/changename/:id", verifyUser, changeTeamName)

export default router