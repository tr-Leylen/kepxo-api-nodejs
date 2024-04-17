import Gift from "../models/gift.model.js"

export const createGift = async (req, res) => {
    try {
        const { score } = req.body
        if (score < 0) return res.status(400).json('Score must be 0 and higher')
        const newGift = await Gift.create({ ...req.body })
        res.status(201).json(newGift)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updateGift = async (req, res) => {
    try {
        const giftId = req.params.id
        const gift = await Gift.findById(giftId)
        if (!gift) return res.status(404).json('Gift not found')
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
        await Gift.findByIdAndDelete(giftId)
        res.status(200).json('Gift deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}