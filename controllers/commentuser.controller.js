import CommentUser from "../models/commentuser.model.js"
import User from "../models/user.model.js"

export const addCommentUser = async (req, res) => {
    try {
        const userId = req.userId
        const comment = await CommentUser.create({ ...req.body, userId })
        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updateComment = async (req, res) => {
    try {
        const userId = req.userId
        const commentId = req.params.id
        const comment = await CommentUser.findById(commentId)
        if (!comment) return res.status(404).json('Comment not found')
        if (comment.userId != userId) return res.status(403).json('You can update only your comment')
        const updatedComment = await CommentUser.findByIdAndUpdate(commentId, { ...req.body, userId }, { new: true })
        res.status(200).json(updatedComment)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteComment = async (req, res) => {
    try {
        const userId = req.userId
        const commentId = req.params.id
        const comment = await CommentUser.findById(commentId)
        if (!comment) return res.status(404).json('Comment not found')
        if (comment.userId == userId || comment.commentUserId == userId) {
            await CommentUser.findByIdAndDelete(commentId)
            return res.status(200).json('Comment deleted')
        } else {
            return res.status(403).json('Comment must be deleted by user or commentUser')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const viewComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const comment = await CommentUser.findById(commentId)
        const [commentUserName, userName] = await Promise.all([
            User.findById(comment.commentUserId),
            User.findById(comment.userId),
        ])
        if (!comment) return res.status(404).json('Comment not found')
        const commentData = {
            ...comment._doc,
            userName: userName?.username,
            commentUserName: commentUserName?.username
        }
        res.status(200).json(commentData)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}