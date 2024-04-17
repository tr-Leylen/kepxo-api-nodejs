import BlockUser from "../models/blockuser.model.js"
import BuyCourse from "../models/buycourse.model.js"
import Follow from "../models/follow.model.js"
import LikeCourse from "../models/likecourse.model.js"
import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import ScoreHistory from "../models/scorehistory.model.js"
import User from "../models/user.model.js"

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        if (req.body.role && user?.role != "admin") return res.status(403).json("You can not change your role")
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json('User not found')
        const userBuyList = await BuyCourse.find({ userId: req.params.id })
        userBuyList.map(async item => await BuyCourse.findByIdAndDelete(item._id))
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password: pass, ...userInfo } = user._doc
        res.status(200).json(userInfo)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getFollowers = async (req, res) => {
    try {
        const userId = req.params.id
        const followers = await Follow.find({ followingId: userId })
        const followerIds = followers.map(item => {
            return item.userId
        })
        res.status(200).json(followerIds)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getFollowings = async (req, res) => {
    try {
        const userId = req.params.id
        const followings = await Follow.find({ userId })
        const followingIds = followings.map(item => {
            return item.followingId
        })
        res.status(200).json(followingIds)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const likedCourses = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const courses = await LikeCourse.find({ userId })
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const buyedCourses = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const buyedList = await BuyCourse.find({ userId })
        res.status(200).json(buyedList)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const blockedUsers = async (req, res) => {
    try {
        const userId = req.userId
        const blockedList = await BlockUser.find({ userId })
        res.status(200).json(blockedList)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const scoreHistory = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const scores = await ScoreHistory.find({ userId })
        res.status(500).json(scores)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const userPosts = async (req, res) => {
    try {
        const userId = req.params.id
        const posts = await Post.find({ userId })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const userNotifications = async (req, res) => {
    try {
        const notificationTo = req.userId
        const notifications = await Notification.find({ notificationTo })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}