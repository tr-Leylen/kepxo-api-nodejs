import Team from "../models/team.model.js"
import User from "../models/user.model.js"

export const createTeam = async (req, res) => {
    try {
        const creatorId = req.userId
        const title = req.body.title
        const userTeams = await Team.find({ members: creatorId })
        if (userTeams.length > 0) return res.status(400).json('A user can only be in one team')
        const team = await Team.create({ title, creatorId, members: [creatorId] })
        res.status(201).json(team)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
        if (!team) return res.status(404).json('Team not found');
        const users = await Promise.all(
            team.members.map(member => User.findById(member))
        )
        const usersDatas = users.map(user => {
            const { email, bio, password, score, role, enable, city, phone, ...userData } = user._doc
            return userData;
        })
        team.members = usersDatas
        res.status(200).json(team)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteMember = async (req, res) => {
    try {
        const teamId = req.params.id
        const memberId = req.body.memberId
        const actionUser = req.userId
        const userRole = req.userRole
        const team = await Team.findById(teamId)
        if (!team) return res.status(404).json("Team not found")
        if (actionUser != team.creatorId && userRole != 'admin') return res.status(401).json("You are not this team's creator")
        const memberExists = team.members.includes(memberId)
        if (!memberExists) return res.status(404).json('User is not team`s member');
        let newMembers = []
        newMembers = team.members.filter(member => member != memberId)
        const updatedTeam = await Team.findByIdAndUpdate(teamId, { members: newMembers }, { new: true })
        const usersDatas = await Promise.all(
            updatedTeam.members.map(userId => User.findById(userId))
        )
        const teamUserList = usersDatas.map(user => {
            let data = {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user?.avatar
            }
            return data;
        })
        updatedTeam.members = teamUserList
        res.status(200).json(updatedTeam)

    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

export const changeTeamName = async (req, res) => {
    try {
        const creatorId = req.userId
        const teamId = req.params.id
        const newTitle = req.body.title
        const team = await Team.findById(teamId)
        if (!team) return res.status(404).json("Team not found")
        if (team.creatorId != creatorId) return res.status(403).json("You are not this team's creator")
        const updatedTeam = await Team.findByIdAndUpdate(teamId, { title: newTitle }, { new: true });
        res.status(200).json(updatedTeam)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteTeam = async (req, res) => {
    try {
        const actionUser = req.userId
        const team = await Team.findById(req.params.id)
        if (!team) return res.status(404).json('Team not found');
        if (team.creatorId != actionUser || req.userRole != 'admin') return res.status(401).json('You are not creator of this team');
        await Team.findByIdAndDelete(team._id)
        res.status(200).json('Team deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

export const exitMember = async (req, res) => {
    try {
        const memberId = req.userId
        const team = await Team.findById(req.params.id);
        if (!team.members.includes(memberId)) return res.status(404).json('You are not team members');
        if (team.creatorId == memberId) {
            await Team.findByIdAndDelete(req.params.id)
            return res.status(200).json('Team deleted')
        }
        let updatedMembers = team.members.filter(item => item != memberId);
        await Team.findByIdAndUpdate(req.params.id, { members: updatedMembers }, { new: true })
        res.status(200).json('User exit from this team');
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findTeamByMemberId = async (req, res) => {
    try {
        const memberId = req.userId
        const team = await Team.find({ members: memberId })
        res.status(200).json(team)
    } catch (error) {
        res.status(500).json(error)
    }
}