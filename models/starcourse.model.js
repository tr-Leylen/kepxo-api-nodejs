import mongoose from "mongoose";

const starCourseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true
    }
})

const StarCourse = mongoose.model('StarCourse', starCourseSchema)

export default StarCourse;