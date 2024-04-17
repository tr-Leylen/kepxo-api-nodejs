import LikeUser from "../models/likeuser.model.js"
import User from "../models/user.model.js"

export const likeUser = async (req, res) => {
    try {
        const userId = req.userId
        const likedUserId = req.params.id
        const user = await User.findById(likedUserId)
        if (!user) return res.status(404).json('User not found')
        const userLikedCurrent = await LikeUser.find({ userId, likedUserId })
        if (userLikedCurrent.length === 0) {
            await LikeUser.create({ userId, likedUserId })
            res.status(200).json('User liked')
        } else {
            const like = await LikeUser.find({ userId, likedUserId })
            await LikeUser.findByIdAndDelete(like[0]._id)
            res.status(200).json('Like removed')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}