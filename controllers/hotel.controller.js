import Hotel from "../models/hotel.model.js"

export const createHotel = async (req, res) => {
    try {
        if (req.body.star > 5) return res.status(400).json('Star value must be max 5')
        const newHotel = await Hotel.create(req.body)
        res.status(201).json(newHotel)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) throw new Error('Hotel not found')
        if (req.body.star > 5) return res.status(400).json('Star value must be max 5')
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, { new: true })
        res.status(200).json(updatedHotel)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) throw new Error('Hotel not found')
        await Hotel.findByIdAndDelete(hotelId)
        // konferans da silinecek
        res.status(200).json('Hotel deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getHotel = async (req, res) => {
    try {
        const hotelId = req.params.id
        const hotel = await Hotel.findById(hotelId)
        if (hotel) {
            res.status(200).json(hotel)
        } else {
            throw new Error('Hotel not found')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getCityHotel = async (req, res) => {
    try {
        const city = req.params.city
        const hotels = await Hotel.find({ city: { $regex: city, $options: 'i' } })
        res.status(200).json(hotels)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getPopularHotels = async (req, res) => {
    try {
        const limit = 10
        const { page } = req.query
        const hotels = await Hotel.find()
            .skip(page * limit)
            .limit(limit)
            .sort({ 'star': -1 })
        res.status(200).json(hotels)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getHotels = async (req, res) => {
    try {
        const limit = 10
        const { page } = req.query
        const hotels = await Hotel.find()
            .skip(page * limit)
            .limit(limit)
        res.status(200).json(hotels)
    } catch (error) {
        res.status(500).json(error)
    }
}