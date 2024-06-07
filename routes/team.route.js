import express from 'express'
import { changeMember, changeTeamName, createTeam, deleteTeam, exitMember, getTeam } from '../controllers/team.controller.js'
import { verifyUser } from '../utils/UserMiddleware.js'

const router = express.Router()

router.post("/create", verifyUser, createTeam)
router.get("/:id", getTeam)
router.put("/changemember/:id", verifyUser, changeMember)
router.put("/changename/:id", verifyUser, changeTeamName)
router.delete("/delete/:id", verifyUser, deleteTeam)
router.put("/exit/:id", verifyUser, exitMember)

export default router