import mongoose from 'mongoose'

const giftTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
})

const GiftType = mongoose.model('GiftType', giftTypeSchema)

export default GiftType;