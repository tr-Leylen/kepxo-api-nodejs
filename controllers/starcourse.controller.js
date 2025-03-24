import Course from "../models/course.model.js";
import StarCourse from "../models/starcourse.model.js"

const possibleStarValues = [1, 2, 3, 4, 5]

const calcStar = async (courseId) => {
    const courseStars = await StarCourse.find({ courseId })
    const starPoints = courseStars.reduce((acc, item) => acc += item.star, 0)
    const starAvg = (starPoints / courseStars.length).toFixed(1)
    return Number(starAvg);
}

export const setStar = async (req, res) => {
    try {
        const { star, courseId } = req.body
        if (!possibleStarValues.includes(+star)) return res.status(400).json('Star value is incorrect');
        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json('Course not found')
        const starExists = await StarCourse.find({ userId: req.userId, courseId });
        if (starExists.length > 0) return res.status(400).json('Course stared by this user')
        const [scoredCourse, starAvg] = await Promise.all([StarCourse.create({ courseId, star: parseInt(star), userId: req.userId }), calcStar(courseId)])
        await Course.findByIdAndUpdate(courseId, { star: starAvg })
        res.status(201).json(scoredCourse)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const updateStar = async (req, res) => {
    try {
        const { star, courseId } = req.body
        const staredId = req.params.id
        if (!possibleStarValues.includes(+star)) return res.status(400).json('Star value is incorrect');
        const starExists = await StarCourse.find({ courseId, userId: req.userId });
        if (starExists.length === 0) return res.status(404).json('This course not stared');
        const [updatedStar, starAvg] = await Promise.all([
            StarCourse.findByIdAndUpdate(staredId, { star }, { new: true }),
            calcStar(courseId)
        ])
        await Course.findByIdAndUpdate(courseId, { star: starAvg })
        res.status(200).json(updatedStar)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteStar = async (req, res) => {
    try {
        const staredId = req.params.id
        const staredCourse = await StarCourse.findById(staredId);
        const courseId = staredCourse.courseId;
        if (!staredCourse) return res.status(404).json('Stared course not found');
        if (staredCourse.userId != req.userId) return res.status(401).json('You delete only your stared course');
        await StarCourse.findByIdAndDelete(staredId)
        const starAvg = await calcStar(courseId)
        await Course.findByIdAndUpdate(courseId, { star: starAvg })
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