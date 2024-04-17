import mongoose from 'mongoose'

const followSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    followingId: {
        type: String,
        required: true
    }
})

const Follow = mongoose.model("Follow", followSchema)

export default Follow;