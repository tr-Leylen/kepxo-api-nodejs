import BuyGift from "../models/buygift.model.js"
import Gift from "../models/gift.model.js"
import User from "../models/user.model.js"

export const buyGift = async (req, res) => {
    try {
        const userId = req.userId
        const giftId = req.params.id
        const gift = await Gift.findById(giftId)
        if (!gift) return res.status(404).json('Gift not found')
        const giftBuyingExists = await BuyGift.find({ userId, giftId })
        if (giftBuyingExists.length === 0) {
            const user = await User.findById(userId)
            const { password: pass, ...userInfo } = user._doc
            if (user.score >= gift.score) {
                await BuyGift.create({ userId, giftId })
                let newScore = user.score - gift.score
                const updatedUser = await User.findByIdAndUpdate(userId, { ...userInfo, score: newScore }, { new: true })
                res.status(201).json(updatedUser)
            } else {
                res.status(400).json("you don't have enough scores")
            }
        } else {
            res.status(400).json('User already buying this gift')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteBuyGift = async (req, res) => {
    try {
        const buyGiftId = req.params.id
        const buyedGift = await BuyGift.findById(buyGiftId)
        if (!buyedGift) return res.status(404).json('Buyed gift not found')
        await BuyGift.findByIdAndDelete(buyGiftId)
        res.status(200).json('Gift buying deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}