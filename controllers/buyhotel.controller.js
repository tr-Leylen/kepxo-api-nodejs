import BuyHotel from "../models/buyhotel.model.js"
import Hotel from "../models/hotel.model.js"
import User from "../models/user.model.js"

export const buyHotel = async (req, res) => {
    try {
        const userId = req.userId
        const hotelId = req.params.id
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) return res.status(404).json('Hotel not found')
        const hotelBuyingExists = await BuyHotel.find({ userId, hotelId })
        if (hotelBuyingExists.length === 0) {
            const user = await User.findById(userId)
            const { password: pass, ...userInfo } = user._doc
            if (user.score >= hotel.score) {
                await BuyHotel.create({ userId, hotelId })
                let newScore = user.score - hotel.score
                const updatedUser = await User.findByIdAndUpdate(userId, { ...userInfo, score: newScore }, { new: true })
                res.status(201).json(updatedUser)
            } else {
                res.status(400).json("you don't have enough scores")
            }
        } else {
            res.status(400).json('User already buying this hotel')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteBuyHotel = async (req, res) => {
    try {
        const buyHotelId = req.params.id
        const buyedHotel = await BuyHotel.findById(buyHotelId)
        if (!buyedHotel) return res.status(404).json('Buyed hotel not found')
        await BuyHotel.findByIdAndDelete(buyHotelId)
        res.status(200).json('Hotel buying deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}