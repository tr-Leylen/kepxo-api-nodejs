import express from 'express'
import { blockedUsers, deleteUser, getFollowers, getFollowings, getTeachers, getUser, likedCourses, scoreHistory, updateUser, userNotifications, userPosts } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/UserMiddleware.js';
import { verifyLogin } from '../utils/LoginMiddleware.js';

const router = express.Router()

router.put("/:id", verifyUser, updateUser)
router.delete("/:id", verifyUser, deleteUser)
router.get("/view/:id", getUser)
router.get("/followers/:id", getFollowers)
router.get("/followings/:id", getFollowings)
router.get("/likedcourses", verifyUser, likedCourses)
router.get("/blockedusers", verifyUser, blockedUsers)
router.get("/scorehistory", verifyUser, scoreHistory)
router.get("/posts/:id", userPosts)
router.get("/notifications", verifyLogin, userNotifications)
router.get("/teachers", getTeachers)

export default router;