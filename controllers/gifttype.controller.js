import { deletePhoto } from "../deletePhoto.js"
import Gift from "../models/gift.model.js"
import GiftType from "../models/gifttype.model.js"

export const createGiftType = async (req, res) => {
    try {
        const { title } = req.body
        const giftType = await GiftType.find({ title })
        if (giftType.length === 0) {
            const newGiftType = await GiftType.create({ title })
            res.status(201).json(newGiftType)
        } else {
            res.status(400).json('Gift type already exists')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updateGiftType = async (req, res) => {
    try {
        const id = req.params.id
        const { title } = req.body
        const giftType = await GiftType.findById(id)
        if (!giftType) throw new Error('Gift type not found')
        const giftTypeExists = await GiftType.find({ title })
        if (giftTypeExists.length > 0) throw new Error('Gift type already exists')
        const newGiftType = await GiftType.findByIdAndUpdate(id, { title }, { new: true })
        res.status(200).json(newGiftType)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteGiftType = async (req, res) => {
    try {
        const id = req.params.id
        const giftType = await GiftType.findById(id)
        if (!giftType) return res.status(404).json('Gift type not found');
        const gifts = await Gift.find({ giftType: giftType._id })
        await Promise.all(gifts.map(item => deletePhoto(item.image)))
        await Promise.all([
            Gift.deleteMany({ giftType: id }),
            GiftType.findByIdAndDelete(id)
        ])
        res.status(200).json('Gift type deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

export const viewGiftType = async (req, res) => {
    try {
        const id = req.params.id
        const giftType = await GiftType.findById(id)
        if (!giftType) return res.status(404).json('Gift type not found')
        res.status(200).json(giftType)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getAllTypes = async (req, res) => {
    try {
        const types = await GiftType.find()
        res.status(200).json(types)
    } catch (error) {
        res.status(500).json(error)
    }
}