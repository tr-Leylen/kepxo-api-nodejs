import mongoose from 'mongoose'

const blockUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    blockedId: {
        type: String,
        required: true
    }
})

const BlockUser = mongoose.model("BlockUser", blockUserSchema)

export default BlockUser;