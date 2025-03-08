import Hotel from "../models/hotel.model.js"
import { deletePhoto } from "../deletePhoto.js"

const getExistHotel = async (id) => {
    const hotel = await Hotel.findById(id)
    if (!hotel) return res.status(404).json('Hotel not found');
    return hotel
}

const hotelValidation = (body) => {
    if (body.star > 5) return res.status(400).json('Star value must be max 5')
    if (body.score < 0) return res.status(400).json('Score can not be negative')
}

export const createHotel = async (req, res) => {
    try {
        hotelValidation(req.body)
        const newHotel = await Hotel.create(req.body)
        res.status(201).json(newHotel)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateHotel = async (req, res) => {
    try {
        getExistHotel(req.params.id)
        hotelValidation(req.body)
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedHotel)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const addImageHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) return res.status(404).json('Hotel not found');
        const updatedImages = await Hotel.findByIdAndUpdate(hotelId, { images: [...hotel.images, req.body.image] }, { new: true })
        res.status(200).json(updatedImages.images)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const removeImageHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) return res.status(404).json('Hotel not found');
        await deletePhoto(req.body.image)
        const newImages = hotel.images.filter(item => item != req.body.image)
        const updatedImages = await Hotel.findByIdAndUpdate(hotelId, { images: newImages }, { new: true })
        res.status(200).json(updatedImages.images)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) throw new Error('Hotel not found')
        await Promise.all(hotel.images.map(image => deletePhoto(image)))
        await Hotel.findByIdAndDelete(hotelId)
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
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const city = req.params.city
        const hotels = await Hotel.find({ city: { $regex: city, $options: 'i' } }).skip(page * limit).limit(limit)
        const totalPages = await Hotel.countDocuments({ city: { $regex: city, $options: 'i' } })
        res.status(200).json({
            data: hotels,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getPopularHotels = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const data = await Promise.all([
            Hotel.find()
                .skip(page * limit)
                .limit(limit)
                .sort({ 'star': -1 }),
            Hotel.countDocuments()
        ])
        const hotels = data[0]
        const totalPages = data[1]
        res.status(200).json({
            data: hotels,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getHotels = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const data = await Promise.all([
            Hotel.find()
                .skip(page * limit)
                .limit(limit),
            Hotel.countDocuments()
        ])
        const hotels = data[0]
        const totalPages = data[1]
        res.status(200).json({
            data: hotels,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find()
        res.status(200).json(hotels)
    } catch (error) {
        res.status(500).json(error)
    }
}