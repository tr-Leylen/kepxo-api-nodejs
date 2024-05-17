import JoinConference from "../models/joinconference.model.js"

export const userJoin = async (req, res) => {
    try {
        const conferenceId = req.params.id
        const userId = req.userId
        const joinExists = await JoinConference.find({ conferenceId, userId })
        if (joinExists.length > 0) {
            await JoinConference.findByIdAndDelete(conferenceId)
            res.status(200).json('User removed from this conference')
        } else {
            await JoinConference.create({ userId, conferenceId })
            res.status(201).json('User joined this conference')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}