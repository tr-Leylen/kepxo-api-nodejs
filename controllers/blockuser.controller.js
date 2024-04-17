import BlockUser from "../models/blockuser.model.js"
import User from "../models/user.model.js"

export const blockUser = async (req, res) => {
    try {
        const userId = req.userId
        const blockedId = req.params.id
        const user = await User.findById(userId)
        const blockedUser = await User.findById(blockedId)
        if (!user || !blockedUser) return res.status(404).json('Some user not found')
        const blockExists = await BlockUser.find({ userId, blockedId })
        if (blockExists.length > 0) {
            await BlockUser.findByIdAndDelete(blockExists[0]._id)
            res.status(200).json('User unblocked')
        } else {
            await BlockUser.create({ userId, blockedId })
            res.status(200).json('User blocked')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}