import { deletePhoto } from "../deletePhoto.js"
import BlockUser from "../models/blockuser.model.js"
import BuyCourse from "../models/buycourse.model.js"
import Course from "../models/course.model.js"
import Follow from "../models/follow.model.js"
import LikeCourse from "../models/likecourse.model.js"
import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import ScoreHistory from "../models/scorehistory.model.js"
import User from "../models/user.model.js"

function convertShortUserData(data = []) {
    const shortData = data.map(item => {
        const { password, ...data } = item._doc
        return data;
    })
    return shortData;
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (req.userRole != "admin" && req.userId !== userId) {
            return res.status(403).json('You can update only your own account')
        }
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        if (req.body.role && user?.role != "admin") return res.status(403).json("You can not change your role");
        if (user.avatar != req.body.avatar) await deletePhoto(user.avatar)
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true })
        const { password, ...userInfo } = updatedUser._doc;
        res.status(200).json(userInfo);
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
        await Promise.all([
            BuyCourse.deleteMany({ userId: user._id }),
            User.findByIdAndUpdate(user._id, { enable: req.userRole === 'admin' ? !user.enable : false })
        ])
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
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.params.id
        const [followers, totalPages] = await Promise.all([
            Follow.find({ followingId: userId }).skip(page * limit).limit(limit),
            Follow.countDocuments({ followingId: userId })
        ])
        const followerIds = followers.map(item => item.userId)
        const followerUsersData = await Promise.all(
            followerIds.map(id => User.findById(id))
        )
        const followerData = convertShortUserData(followerUsersData)
        res.status(200).json({
            data: followerData,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getFollowings = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.params.id
        const [followings, totalPages] = await Promise.all([
            Follow.find({ userId }).skip(page * limit).limit(limit),
            Follow.countDocuments({ userId })
        ])
        const followingIds = followings.map(item => item.followingId)
        const followingsUserData = await Promise.all(followingIds.map(id => User.findById(id)))
        const followingData = convertShortUserData(followingsUserData)
        res.status(200).json({
            data: followingData,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const likedCourses = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const [courses, totalPages] = await Promise.all([
            LikeCourse.find({ userId }).skip(page * limit).limit(limit),
            LikeCourse.countDocuments({ userId })
        ])
        const courseIds = courses.map(item => item._id)
        const likedData = await Promise.all(
            courseIds.map(id => Course.findById(id))
        )
        res.status(200).json({
            data: likedData,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const buyedCourses = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const [buyedList, totalPages] = await Promise.all([
            BuyCourse.find({ userId }).skip(page * limit).limit(limit),
            BuyCourse.countDocuments({ userId })
        ])
        const courseIds = buyedList.map(buy => buy.courseId)
        const courseData = await Promise.all(
            courseIds.map(id => Course.findById(id))
        )
        res.status(200).json({
            data: courseData,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const blockedUsers = async (req, res) => {
    try {
        const userId = req.userId
        const blockedList = await BlockUser.find({ userId })
        const blockedUserIds = blockedList.map(item => item.blockedId)
        const usersData = await Promise.all(blockedUserIds.map(id => User.findById(id)))
        const shortUserData = convertShortUserData(usersData)
        res.status(200).json(shortUserData)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const scoreHistory = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json('User not found')
        const [scores, totalPages] = await Promise.all([
            ScoreHistory.find({ userId }).skip(page * limit).limit(limit),
            ScoreHistory.countDocuments({ userId })
        ])
        const courseIds = scores.map(score => score.courseId)
        const courseDatas = await Promise.all(
            courseIds.map(id => Course.findById(id))
        )
        res.status(200).json({
            data: courseDatas,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const userPosts = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const userId = req.params.id
        const [posts, totalPages] = await Promise.all([
            Post.find({ userId }).skip(page * limit).limit(limit),
            Post.countDocuments({ userId })
        ])
        res.status(200).json({
            data: posts,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const userNotifications = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 20
        const notificationTo = req.userId
        const [notifications, totalPages] = await Promise.all([
            Notification.find({ notificationTo })
                .skip(page * limit)
                .limit(limit),
            Notification.countDocuments()
        ])
        res.status(200).json({
            data: notifications,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' })
        const teachersShortData = convertShortUserData(teachers)
        res.status(200).json(teachersShortData)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getTeachersPaged = async (req, res) => {
    try {
        const limit = req.query.limit || 9
        const page = req.query.page || 0
        const [teachers, totalCount] = await Promise.all([
            User.find({ role: 'teacher' })
                .skip(page * limit)
                .limit(limit),
            User.countDocuments({ role: 'teacher' })
        ])
        const teachersShortData = convertShortUserData(teachers)
        res.status(200).json({
            data: teachersShortData,
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
        const [users, totalCount] = await Promise.all([
            User.find({ role: 'user' })
                .skip(page * limit)
                .limit(limit),
            User.countDocuments({ role: 'user' })
        ])
        const usersShortData = convertShortUserData(users)
        res.status(200).json({
            data: usersShortData,
            totalPages: Math.ceil(totalCount / limit)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getFriendDiscovery = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        const friends = await Follow.find({ userId: req.userId })
            .limit(limit)
            .skip(page * limit)
        const friendsPosts = await Promise.all(
            friends.map(async friend => {
                const friendLastPost = await Post.find({ userId: friend.followingId })
                return friendLastPost.at(-1);
            })
        )
        let posts = []
        friendsPosts.map(item => {
            if (item) {
                posts.push(item)
            }
        })
        res.status(200).json(posts)
    } catch (error) {
        return error
    }
}

export const getNormalDiscovery = async (req, res) => {
    try {
        const page = req.query.page || 0
        const limit = req.query.limit || 10
        if (limit < 1) return res.status(200).json([])
        const [posts, totalPages] = await Promise.all([
            Post.find().skip(page * limit).limit(limit * 3),
            Post.countDocuments()
        ])
        posts.sort(() => Math.random() - 0.5)
        let randomPosts = posts.slice(0, limit)
        res.status(200).json({
            data: randomPosts,
            totalPages: Math.ceil(totalPages / limit)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const searchUser = async (req, res) => {
    try {
        const { username, page, limit } = req.query
        const [users, usersCount] = await Promise.all([
            User.find({
                username: { $regex: username, $options: 'i' },
                role: 'user'
            })
                .limit(limit)
                .skip(page * limit),
            User.countDocuments({
                username: { $regex: username, $options: 'i' },
                role: 'user'
            })
        ])
        const usersShortData = convertShortUserData(users)
        const data = {
            data: usersShortData,
            totalPages: Math.ceil(usersCount / limit)
        }
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const searchTeacher = async (req, res) => {
    try {
        const { username, page, limit } = req.query
        const [teachers, teachersCount] = await Promise.all([
            User.find({
                username: { $regex: username, $options: 'i' },
                role: 'teacher'
            })
                .limit(limit)
                .skip(page * limit),
            User.countDocuments({
                username: { $regex: username, $options: 'i' },
                role: 'teacher'
            })
        ])
        const teachersShortData = convertShortUserData(teachers)
        const data = {
            data: teachersShortData,
            totalPages: Math.ceil(teachersCount / limit)
        }
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}