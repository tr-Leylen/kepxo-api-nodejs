import mongoose from 'mongoose'

const giftSchema = new mongoose.Schema({
    giftType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    star: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    }
})

const Gift = mongoose.model('Gift', giftSchema)

export default Gift;