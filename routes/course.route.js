import express from 'express'
import { acceptCourse, courseLikedUsers, coursesForCategory, createCourse, deleteCourse, getAllCoursesAdmin, getCourse, getNoAcceptedCourses, getRecommendedCourses, getTeacherCourses, searchCourse, searchCourseTitle, updateCourse } from '../controllers/course.controller.js';
import { verifyTeacher } from '../utils/TeacherMiddleware.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.post("/create", verifyTeacher, createCourse)
router.put("/update/:id", verifyTeacher, updateCourse)
router.delete("/delete/:id", verifyTeacher, deleteCourse)
router.get("/list/:id", getTeacherCourses)
router.put("/accept/:id", verifyAdmin, acceptCourse)
router.get("/search", searchCourse)
router.get("/search-title", searchCourseTitle)
router.get("/view/:id", getCourse)
router.get("/recommended", getRecommendedCourses)
router.get("/likedusers/:id", courseLikedUsers)
router.get("/no-accepted", verifyAdmin, getNoAcceptedCourses)
router.get("/all", verifyAdmin, getAllCoursesAdmin)
router.get("/from-category/:categoryId", coursesForCategory)

export default router;