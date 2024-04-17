import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    imageLink: {
        type: String
    },
    postText: {
        type: String
    }
})

const Post = mongoose.model('Post', postSchema)

export default Post;