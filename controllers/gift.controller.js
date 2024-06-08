import { deletePhoto } from "../deletePhoto.js";
import BuyGift from "../models/buygift.model.js";
import Gift from "../models/gift.model.js"
import GiftType from "../models/gifttype.model.js";

export const createGift = async (req, res) => {
    try {
        const { score, giftType } = req.body
        if (score < 0) return res.status(400).json('Score must be 0 and higher');
        const type = await GiftType.findById(giftType)
        if (!type) return res.status(404).json('Gift type not found')
        const newGift = await Gift.create({ ...req.body });
        res.status(201).json(newGift)
    } catch (error) {
        res.status(500).json('Internal Server Error');
    }
}

export const updateGift = async (req, res) => {
    try {
        const giftId = req.params.id
        const giftTypeId = req.body.giftType
        const gift = await Gift.findById(giftId)
        if (!gift) return res.status(404).json('Gift not found');
        const giftType = await GiftType.findById(giftTypeId)
        if (!giftType) return res.status(404).json('Gift type not found');
        if (gift.image != req.body.image) {
            await deletePhoto(gift.image)
        }
        const updatedGift = await Gift.findByIdAndUpdate(giftId, { ...req.body }, { new: true })
        res.status(200).json(updatedGift)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const viewGift = async (req, res) => {
    try {
        const giftId = req.params.id
        const gift = await Gift.findById(giftId)
        if (!gift) return res.status(404).json(gift)
        res.status(200).json(gift)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteGift = async (req, res) => {
    try {
        const giftId = req.params.id
        const gift = await Gift.findById(giftId)
        if (!gift) return res.status(404).json('Gift not found')
        await BuyGift.deleteMany({ giftId })
        await deletePhoto(gift.image)
        await Gift.findByIdAndDelete(giftId)
        res.status(200).json('Gift deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getAllGifts = async (req, res) => {
    try {
        const data = await Gift.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const searchGift = async (req, res) => {
    try {
        const title = req.query.title
        if (!title) return res.status(200).json([])
        const gifts = await Gift.find({
            title: { $regex: title, $options: 'i' }
        })
        res.status(200).json(gifts)
    } catch (error) {
        res.status(500).json(error)
    }
}