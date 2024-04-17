import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    },
    blockList: {
        type: Array
    },
    favoriteCourses: {
        type: Array
    },
    registeredCards: {
        type: Array
    },
    myCourses: {
        type: Array
    },
    scoreHistory: {
        type: Array
    },
    score: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    }
})

const User = mongoose.model('User', userSchema)

export default User;