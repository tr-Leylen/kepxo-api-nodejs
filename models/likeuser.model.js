import mongoose from 'mongoose'

const likeUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    likedUserId: {
        type: String,
        required: true
    }
})

const LikeUser = mongoose.model('LikeUser', likeUserSchema)

export default LikeUser;