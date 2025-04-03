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
        type: String,
        default: null
    },
    score: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    },
    enable: {
        type: Boolean,
        default: true
    }
})

const User = mongoose.model('User', userSchema)

export default User;