import { deletePhoto } from "../deletePhoto.js"
import BuyCourse from "../models/buycourse.model.js"
import Category from "../models/category.model.js"
import Course from "../models/course.model.js"
import LikeCourse from "../models/likecourse.model.js"
import User from "../models/user.model.js"

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
        await Promise.all([
            BuyCourse.deleteMany({ courseId: req.params.id }),
            Course.findByIdAndDelete(course._id)
        ])
        res.status(200).json('Course deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json('Course not found');
        const category = await Category.findById(course.categoryId)
        const courseInfo = {
            ...course._doc,
            categoryName: category.title
        }
        res.status(200).json(courseInfo)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getTeacherCourses = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.params.id
        const [courses, totalPages] = await Promise.all([
            Course.find({ ownerId: userId, accepted: true }).skip(page * limit).limit(limit),
            Course.countDocuments({ ownerId: userId, accepted: true })
        ])
        res.status(200).json({
            data: courses,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getRecommendedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ accepted: true })
            .sort({ 'star': -1 })
            .limit(10)
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
                $regex: searchTerm, $options: 'i',
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

export const searchCourseTitle = async (req, res) => {
    try {
        const { title, page, limit } = req.query;
        const searchTitle = title || ''
        let searchPattern = searchTitle.split('').map(char => {
            switch (char.toLowerCase()) {
                case 'i':
                case 'ı':
                    return '[iıIİ]';
                case 's':
                    return '[sşSŞ]';
                case 'g':
                    return '[gğGĞ]';
                case 'u':
                    return '[uüUÜ]';
                case 'o':
                    return '[oöOÖ]';
                case 'c':
                    return '[cçCÇ]';
                default:
                    // Diğer karakterler için regex escape yapılması gerekebilir
                    return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
        }).join('');
        const courses = Course.find({
            title: { $regex: searchPattern, $options: 'i' },
            accepted: true
        })
            .limit(limit)
            .skip(page * limit)
        const courseCount = Course.countDocuments({
            title: { $regex: title, $options: 'i' },
            accepted: true
        })
        const data = await Promise.all([courses, courseCount])
        res.status(200).json({
            data: data[0],
            totalPages: Math.ceil(data[1] / limit)
        })
    } catch (error) {
        return error
    }
}

export const courseLikedUsers = async (req, res) => {
    try {
        const courseId = req.params.id
        const likeArray = await LikeCourse.find({ courseId })
        const likedUserIds = likeArray.map(item => item.userId)
        const users = await Promise.all(likedUserIds.map(id => User.findById(id)))
        const usersShortData = users.map(user => {
            let data = {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
            }
            return data;
        })
        return res.status(200).json(usersShortData)
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
        res.status(500).json(error)
    }
}

export const getNoAcceptedCourses = async (req, res) => {
    try {
        const limit = req.query.limit || 10
        const page = req.query.page || 0
        const courses = await Course.find({ accepted: false }).skip(page * limit).limit(limit)
        const totalPages = await Course.countDocuments({ accepted: false })
        res.status(200).json({
            data: courses,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getAllCoursesAdmin = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const [courses, totalPages] = await Promise.all([
            await Course.find({ accepted: true }).skip(page * limit).limit(limit),
            await Course.countDocuments({ accepted: true })
        ])
        let coursesData = await Promise.all(
            courses.map(course => {
                const owner = User.findById(course.ownerId)
                return {
                    ...course._doc,
                    ownerName: owner?.username || null
                }
            })
        )
        res.status(200).json({
            data: coursesData,
            totalPages: Math.ceil(totalPages / limit)
        })
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