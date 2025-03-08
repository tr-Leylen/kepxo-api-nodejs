import mongoose from 'mongoose'

const buyHotelSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    hotelId: {
        type: String,
        required: true
    }
})

const BuyHotel = mongoose.model('BuyHotel', buyHotelSchema)

export default BuyHotel;