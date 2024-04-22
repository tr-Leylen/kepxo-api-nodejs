import BuyCourse from "../models/buycourse.model.js"
import Category from "../models/category.model.js"
import Course from "../models/course.model.js"
import LikeCourse from "../models/likecourse.model.js"

export const createCourse = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const category = await Category.findById(categoryId)
        if (!category) return res.status(404).json('Category not found')
        const course = await Course.create(req.body)
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json(error)
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
        const updateCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
        await Course.findByIdAndDelete(req.params.id)
        res.status(200).json("Course deleted")
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json('Course not found')
        res.status(200).json(course)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getRecommendedCourses = async (req, res) => {
    try {
        const courses = await Course.find().limit(3)
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
            }
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