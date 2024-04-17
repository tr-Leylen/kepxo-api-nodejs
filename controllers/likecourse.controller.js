import Course from "../models/course.model.js"
import LikeCourse from "../models/likecourse.model.js"

export const likeCourse = async (req, res) => {
    try {
        const userId = req.userId
        const courseId = req.params.id
        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json("Course not found")
        const userLikedCurrentCourse = await LikeCourse.find({ userId, courseId })
        if (userLikedCurrentCourse.length === 0) {
            await LikeCourse.create({ userId, courseId })
            return res.status(200).json("Course liked")
        } else {
            const like = await LikeCourse.find({ userId, courseId })
            await LikeCourse.findByIdAndDelete(like[0]._id)
            return res.status(200).json("Course like removed")
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}