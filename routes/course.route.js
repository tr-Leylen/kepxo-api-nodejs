import express from 'express'
import { courseLikedUsers, createCourse, deleteCourse, getCourse, getRecommendedCourses, getTeacherCourses, searchCourse, updateCourse } from '../controllers/course.controller.js';
import { verifyTeacher } from '../utils/TeacherMiddleware.js';

const router = express.Router()

router.post("/create", verifyTeacher, createCourse)
router.put("/update/:id", verifyTeacher, updateCourse)
router.delete("/delete/:id", verifyTeacher, deleteCourse)
router.get("/list/:id", verifyTeacher, getTeacherCourses)
router.get("/search?:search", searchCourse)
router.get("/view/:id", getCourse)
router.get("/recommended", getRecommendedCourses)
router.get("/likedusers/:id", courseLikedUsers)

export default router;