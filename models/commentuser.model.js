import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    commentUserId: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    }
})

const CommentUser = mongoose.model('CommentUser', commentSchema)

export default CommentUser;