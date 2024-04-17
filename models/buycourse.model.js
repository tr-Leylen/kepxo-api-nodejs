import mongoose from "mongoose"

const buycourseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    }
})

const BuyCourse = mongoose.model('BuyCourse', buycourseSchema)

export default BuyCourse;