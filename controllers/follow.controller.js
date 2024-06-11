import { userSockets } from "../index.js"
import Follow from "../models/follow.model.js"
import Notification from "../models/notification.model.js"

export const followUser = async (req, res) => {
    try {
        const userId = req.userId
        const followingId = req.params.id
        const followExists = await Follow.find({ userId, followingId })
        if (followExists.length > 0) {
            await Follow.findByIdAndDelete(followExists[0]._id)
            return res.status(200).json('User unfollowed')
        } else {
            await Follow.create({ userId, followingId })
            const notification = await Notification.create({
                notificationTo: followingId,
                notificationFrom: userId,
                actionType: 'follow'
            })
            const socketId = userSockets[followingId]
            if (socketId) {
                req.io.to(socketId).emit('notification', notification)
            }
            return res.status(201).json("User followed")
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}