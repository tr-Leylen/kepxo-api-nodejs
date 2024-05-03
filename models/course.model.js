import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    }
})

const Course = mongoose.model('Course', courseSchema)

export default Course;