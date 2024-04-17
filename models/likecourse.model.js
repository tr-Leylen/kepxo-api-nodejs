import mongoose from 'mongoose'

const likeCourseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    }
})

const LikeCourse = mongoose.model('LikeCourse', likeCourseSchema)

export default LikeCourse;