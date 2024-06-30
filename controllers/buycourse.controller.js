import BuyCourse from "../models/buycourse.model.js"
import Course from "../models/course.model.js"
import ScoreHistory from "../models/scorehistory.model.js"
import Team from "../models/team.model.js"
import User from "../models/user.model.js"

export const buyCourse = async (req, res) => {
    try {
        const userId = req.body.userId
        const courseId = req.body.courseId
        const [
            course,
            user,
            userTeams
        ] = await Promise.all([
            Course.findById(courseId),
            User.findById(userId),
            Team.find({ "members": userId })
        ])
        if (!course) return res.status(404).json("Course not found")
        const sameUserAndCourse = await BuyCourse.find({ userId, courseId })
        if (sameUserAndCourse?.length === 0) {
            const buyedCourse = await BuyCourse.create({ userId, courseId })
            await Promise.all([
                User.findByIdAndUpdate(userId, { score: user.score + course.score }, { new: true }),
                ScoreHistory.create({ userId, courseId })
            ])
            let teamMembers = []
            userTeams.map(team => {
                teamMembers = [...teamMembers, ...team.members]
            })
            let teamMembersNoDublicate = [...new Set(teamMembers)]
            teamMembersNoDublicate.map(async member => {
                let sameBuy = await BuyCourse.find({ userId: member, courseId })
                if (sameBuy.length === 0) {
                    await BuyCourse.create({ userId: member, courseId })
                }
            })
            return res.status(200).json(buyedCourse)
        }
        return res.status(400).json("User already buyed this course")
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteBuyCourse = async (req, res) => {
    try {
        const buyId = req.params.id
        const buyedCourse = await BuyCourse.findById(buyId)
        if (!buyedCourse) return res.status(404).json('This course not found buy list')
        await BuyCourse.findByIdAndDelete(buyId)
        return res.status(200).json('Buying data deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}