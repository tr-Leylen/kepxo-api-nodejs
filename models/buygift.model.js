import mongoose from 'mongoose'

const buyGiftSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    giftId: {
        type: String,
        required: true
    }
})

const BuyGift = mongoose.model('BuyGift', buyGiftSchema)

export default BuyGift;