import express from 'express'
import { changeTeamName, createTeam, deleteMember, deleteTeam, exitMember, findTeamByMemberId, getTeam } from '../controllers/team.controller.js'
import { verifyUser } from '../utils/UserMiddleware.js'

const router = express.Router()

router.post("/create", verifyUser, createTeam)
router.get("/view/:id", getTeam)
router.put("/removemember/:id", verifyUser, deleteMember)
router.put("/changename/:id", verifyUser, changeTeamName)
router.delete("/delete/:id", verifyUser, deleteTeam)
router.put("/exit/:id", verifyUser, exitMember)
router.get("/find", verifyUser, findTeamByMemberId)

export default router