import express from 'express'
import { acceptCourse, courseLikedUsers, createCourse, deleteCourse, getCourse, getNoAcceptedCourses, getRecommendedCourses, getTeacherCourses, searchCourse, updateCourse } from '../controllers/course.controller.js';
import { verifyTeacher } from '../utils/TeacherMiddleware.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.post("/create", verifyTeacher, createCourse)
router.put("/update/:id", verifyTeacher, updateCourse)
router.delete("/delete/:id", verifyTeacher, deleteCourse)
router.get("/list/:id", getTeacherCourses)
router.put("/accept/:id", verifyAdmin, acceptCourse)
router.get("/search?:search", searchCourse)
router.get("/view/:id", getCourse)
router.get("/recommended", getRecommendedCourses)
router.get("/likedusers/:id", courseLikedUsers)
router.get("/no-accepted", verifyAdmin, getNoAcceptedCourses)

export default router;