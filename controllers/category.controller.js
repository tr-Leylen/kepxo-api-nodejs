import Category from "../models/category.model.js"
import Course from "../models/course.model.js"

export const createCategory = async (req, res) => {
    try {
        const { title } = req.body
        const category = await Category.find({ title })
        if (category.length > 0) return res.status(400).json('Category exists')
        const newCategory = await Category.create({ title })
        res.status(201).json(newCategory)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const newTitle = req.body.title
        const category = await Category.findById(categoryId)
        if (!category) return res.status(404).json('Category not found')
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title: newTitle }, { new: true })
        res.status(200).json(updatedCategory)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await Category.findById(categoryId)
        if (!category) return res.status(404).json('Category not found')
        const courses = await Course.find({ categoryId })
        await Category.findByIdAndDelete(categoryId)
        await Promise.all(
            courses.map(course => Course.findByIdAndUpdate(course._id, { enable: false, accepted: false }))
        )
        // await Course.deleteMany({ categoryId })
        res.status(200).json('Category deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getCategory = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)
        if (!category) return res.status(404).json('Category not found')
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}