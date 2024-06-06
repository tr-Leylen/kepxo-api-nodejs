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
        if (req.userRole != "admin" && req.userId !== userId) {
            return res.status(403).json('You can update only your own account')
        }
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
        if (req.userRole != "admin" && req.userId !== req.params.id) {
            return res.status(403).json('You can delete only your own account')
        }
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json('User not found')
        await BuyCourse.deleteMany({ userId: user._id })
        await User.findByIdAndUpdate(user._id, { enable: req.userRole === 'admin' ? !user.enable : false })
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
        const courseIds = courses.map(item => {
            return item._id
        })
        res.status(200).json(courseIds)
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
        const blokedUserIds = blockedList.map(item => {
            return item._id
        })
        res.status(200).json(blokedUserIds)
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

export const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' })
        const teachersData = teachers.map(item => item._id)
        res.status(200).json(teachersData)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getTeachersPaged = async (req, res) => {
    try {
        const limit = 9
        const { page } = req.query
        const teachers = await User.find({ role: 'teacher' })
            .skip(page * limit)
            .limit(limit)

        const totalCount = await User.countDocuments({ role: 'teacher' })
        const teachersData = teachers.map(item => item._id)
        res.status(200).json({
            data: teachersData,
            totalPages: Math.ceil(totalCount / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUsersPaged = async (req, res) => {
    try {
        const limit = 9
        const { page } = req.query
        const users = await User.find({ role: 'user' })
            .skip(page * limit)
            .limit(limit)
        const totalCount = await User.countDocuments({ role: 'user' })

        const usersData = users.map(item => item._id)
        res.status(200).json({
            data: usersData,
            totalPages: Math.ceil(totalCount / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getFriendDiscovery = async (req, res) => {
    try {
        const friends = await Follow.find({ userId: req.userId })
        const friendsPosts = await Promise.all(
            friends.map(async friend => {
                const friendLastPost = (await Post.find({ userId: friend.followingId }))
                return friendLastPost.at(-1);
            })
        )
        res.status(200).json(friendsPosts)
    } catch (error) {
        return error
    }
}

export const getNormalDiscovery = async (req, res) => {
    try {
        const posts = await Post.find().limit(40)
        let randomPosts = []
        let array = Array.from({ length: posts.length }, (_, i) => i);
        array.sort(() => Math.random() - 0.5)
        for (let i = 0; i < array.length; i++) {
            if (randomPosts.length === 20) {
                break;
            }
            randomPosts.push(posts[array[i]])
        }
        res.status(200).json(randomPosts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}