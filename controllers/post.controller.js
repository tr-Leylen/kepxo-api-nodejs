import { deletePhoto } from "../deletePhoto.js"
import LikePost from "../models/likepost.model.js"
import Post from "../models/post.model.js"

export const addPost = async (req, res) => {
    try {
        const userId = req.userId
        if (req.body.imageLink || req.body.postText) {
            const post = await Post.create({ userId, ...req.body })
            res.status(201).json(post)
        } else {
            res.status(400).json('Image or postText required')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updatePost = async (req, res) => {
    try {
        const userId = req.userId
        const postId = req.params.id
        if (req.body.postText || req.body.imageLink) {
            const post = await Post.findById(postId)
            if (!post) return res.status(404).json('Post not found')
            if (userId != post.userId) return res.status(403).json('You can update only your posts');
            if (post.imageLink != req.body.imageLink) await deletePhoto(post.imageLink)
            const updatedPost = await Post.findByIdAndUpdate(postId, { ...req.body }, { new: true })
            res.status(200).json(updatedPost)
        } else {
            res.status(400).json('Image or postText required')
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deletePost = async (req, res) => {
    try {
        const userId = req.userId
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json('Post not found')
        if (userId != post.userId) return res.status(403).json('You can delete only your posts');
        await deletePhoto(post.imageLink)
        await Post.findByIdAndDelete(postId)
        res.status(200).json('Post deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const viewPost = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json('Post not found')
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
}

export const likedUsers = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json(post)
        const likedList = await LikePost.find({ postId })
        const likedUserIds = likedList.map(item => {
            return item.userId
        })
        res.status(200).json(likedUserIds)
    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
}