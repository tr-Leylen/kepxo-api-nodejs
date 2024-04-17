import Team from "../models/team.model.js"

export const createTeam = async (req, res) => {
    try {
        const team = await Team.create(req.body)
        res.status(201).json(team)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
        if (!team) return res.status(404).json('Team not found')
        res.status(200).json(team)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const changeMember = async (req, res) => {
    try {
        const teamId = req.params.id
        const memberId = req.body.memberId
        const actionUser = req.userId
        const team = await Team.findById(teamId)
        if (!team) return res.status(404).json("Team not found")
        if (!team.members.includes(actionUser)) return res.status(401).json("You are not this team's member")
        const memberExists = team.members.includes(memberId)
        let newMembers = []
        if (memberExists) {
            newMembers = team.members.filter(member => member != memberId)
            const updatedTeam = await Team.findByIdAndUpdate(teamId, { members: newMembers }, { new: true })
            res.status(200).json(updatedTeam)
        } else {
            newMembers = [...team.members, memberId]
            const updatedTeam = await Team.findByIdAndUpdate(teamId, { members: newMembers }, { new: true })
            res.status(200).json(updatedTeam)
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const changeTeamName = async (req, res) => {
    try {
        const actionUser = req.userId
        const teamId = req.params.id
        const newTitle = req.body.title
        const team = await Team.findById(teamId)
        if (!team) return res.status(404).json("Team not found")
        if (!team.members.includes(actionUser)) return res.status(403).json("You are not this team's member")
        const updatedTeam = await Team.findByIdAndUpdate(teamId, { title: newTitle }, { new: true })
        res.status(200).json(updatedTeam)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}