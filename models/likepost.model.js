import mongoose from 'mongoose'

const likePostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    }
})

const LikePost = mongoose.model('LikePost', likePostSchema)

export default LikePost;