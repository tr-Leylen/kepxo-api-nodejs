import StarCourse from "../models/starcourse.model.js"

export const setStar = async (req, res) => {
    try {
        const { star, courseId } = req.body
        if (star > 5 && star < 1 && star % 1 != 0) return res.status(400).json('Star value is incorrect');
        const starExists = await StarCourse.find({ userId: req.userId, courseId });
        if (starExists.length > 0) return res.status(400).json('Course stared by this user')
        const scoredCourse = await StarCourse.create({ courseId, star, userId: req.userId })
        res.status(201).json(scoredCourse)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateStar = async (req, res) => {
    try {
        const { star, courseId } = req.body
        const staredId = req.params.id
        const starExists = await StarCourse.find({ courseId, userId: req.userId });
        if (starExists.length === 0) return res.status(404).json('This course not stared');
        const updatedStar = await StarCourse.findByIdAndUpdate(staredId, { star }, { new: true })
        res.status(200).json(updatedStar)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteStar = async (req, res) => {
    try {
        const staredId = req.params.id
        const staredCourse = await StarCourse.findById(staredId);
        if (!staredCourse) return res.status(404).json('Stared course not found');
        if (staredCourse.userId != req.userId) return res.status(401).json('You delete only your stared course');
        await StarCourse.findByIdAndDelete(staredId)
        res.status(200).json('Star course deleted');
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getStar = async (req, res) => {
    try {
        const staredId = req.params.id
        const staredCourse = await StarCourse.findById(staredId)
        res.status(200).json(staredCourse)
    } catch (error) {
        res.status(500).json(error)
    }
}