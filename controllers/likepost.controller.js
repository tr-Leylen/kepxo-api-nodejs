import { userSockets } from "../index.js"
import LikePost from "../models/likepost.model.js"
import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"

export const likePost = async (req, res) => {
    try {
        const userId = req.userId
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json('Post not found')
        const userLikedCurrentPost = await LikePost.find({ userId, postId })
        if (userLikedCurrentPost.length === 0) {
            const data = await Promise.all([
                LikePost.create({ userId, postId }),
                Notification.create({
                    notificationTo: post.userId,
                    notificationFrom: userId,
                    actionType: 'like'
                })
            ])

            const notification = data[1]
            const socketId = userSockets[notification.notificationTo]
            if (socketId) {
                req.io.to(socketId).emit('notification', notification)
            }
            res.status(200).json('Post liked')
        } else {
            const like = await LikePost.find({ userId, postId })
            await LikePost.findByIdAndDelete(like[0]._id)
            res.status(200).json('Like removed')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}