import { deletePhoto } from "../deletePhoto.js"
import BuyCourse from "../models/buycourse.model.js"
import Category from "../models/category.model.js"
import Course from "../models/course.model.js"
import LikeCourse from "../models/likecourse.model.js"
import StarCourse from "../models/starcourse.model.js"

export const createCourse = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const ownerId = req.userId
        const userRole = req.userRole
        const accepted = req.body.accepted
        if (accepted) return res.status(403).json("You don't set is accept property")
        const courseData = { ...req.body, ownerId: userRole === "teacher" ? ownerId : req.body.ownerId }
        const category = await Category.findById(categoryId)
        if (!category) return res.status(404).json('Category not found')
        const course = await Course.create(courseData)
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updateCourse = async (req, res) => {
    try {
        const role = req.userRole
        const userId = req.userId
        const categoryId = req.body.categoryId
        const category = await Category.findById(categoryId)
        if (!category) return res.status(404).json('Category not found')
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json("Course not found")
        if (role === 'teacher' && userId !== course.ownerId) return res.status(401).json('you can only update your own course')
        const { accepted, ...courseInfo } = req.body
        if (course.avatar != req.body.avatar) await deletePhoto(course.avatar)
        const updateCourse = await Course.findByIdAndUpdate(req.params.id, courseInfo, { new: true })
        res.status(200).json(updateCourse)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const role = req.userRole
        const userId = req.userId
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json("Course not found")
        if (role === 'teacher' && userId !== course.ownerId) return res.status(401).json('you can only delete your own course')
        const courseBuyedList = await BuyCourse.find({ courseId: req.params.id })
        courseBuyedList.map(async item => await BuyCourse.findByIdAndDelete(item._id))
        if (!course.accepted) return res.status(400).json('Course waiting for accept!')
        const changedCourse = await Course.findByIdAndUpdate(req.params.id, { enable: !course.enable, accepted: course.enable ? false : true }, { new: true })
        res.status(200).json(changedCourse)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json('Course not found');
        const courseStars = await StarCourse.find({ courseId: req.params.id });
        const starPoints = courseStars.reduce((acc, item) => acc += item.star, 0)
        const starAvg = (starPoints / courseStars.length).toFixed(1)
        course.star = starAvg
        res.status(200).json(course)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getTeacherCourses = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.params.id
        const courses = await Course.find({ ownerId: userId, accepted: true }).skip(page * limit).limit(limit)
        const totalPages = await Course.countDocuments({ownerId:userId, accepted:true})
        res.status(200).json({
            data:courses,
            totalPages: Math.ceil(totalPages/limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getRecommendedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ accepted: true, star: 5 }).limit(10)
        courses.sort(() => Math.random() - 0.5)
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const searchCourse = async (req, res) => {
    try {
        const searchTerm = req.query.search || ''
        const category = req.query.category || ''
        const courses = await Course.find({
            title: {
                $regex: searchTerm, $options: 'i'
            },
            category: {
                $regex: category, $options: 'i'
            },
            accepted: true
        })
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const courseLikedUsers = async (req, res) => {
    try {
        const courseId = req.params.id
        const likeArray = await LikeCourse.find({ courseId })
        const likedUserIds = likeArray.map(item => {
            return item._id
        })
        return res.status(200).json(likedUserIds)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const acceptCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        const score = req.body.score
        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json('Course not found')
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { accepted: !course.accepted, score }, { new: true })
        res.status(200).json(updatedCourse)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

export const getNoAcceptedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ accepted: false })
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find({ accepted: true })
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const coursesForCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId
        const courses = await Course.find({ categoryId })
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json(error)
    }
}