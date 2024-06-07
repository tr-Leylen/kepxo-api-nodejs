import InviteTeam from "../models/invite_team.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const sendInvite = async (req, res) => {
    try {
        const actionUser = req.userId;
        if (actionUser === req.params.id) return res.status(403).json('You not invited yourself');
        const invitedUser = await User.findById(req.params.id)
        if (!invitedUser) return res.status(404).json('Invited user not found')
        const team = await Team.findOne({ creatorId: actionUser })
        if (!team) return res.status(404).json('Team not found');
        const inviteExists = await InviteTeam.find({
            senderId: actionUser,
            invitedUser: req.params.id
        })
        if (inviteExists) return res.status(400).json('User already invited')
        const invite = await InviteTeam.create({
            invitedUser: req.params.id,
            teamId: team._id,
            senderId: actionUser
        });
        res.status(201).json(invite)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userInviteList = async (req, res) => {
    try {
        const userId = req.userId;
        const inviteList = await InviteTeam.find({ invitedUser: userId })
        res.status(200).json(inviteList)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const acceptInvite = async (req, res) => {
    try {
        const userId = req.userId;
        const inviteId = req.params.id;
        const userTeams = await Team.find({ members: userId })
        if (!userTeams) return res.status(400).json('User join only one team')
        const invite = await InviteTeam.findById(inviteId);
        if (!invite) return res.status(404).json('Invite not found')
        const team = await Team.findById(invite.teamId);
        if (!team) return res.status(404).json('Team not found')
        await Team.findByIdAndUpdate(team._id, { members: [...team.members, userId] })
        await InviteTeam.deleteMany({ invitedUser: userId })
        res.status(200).json('User accepted the invite')
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteInvite = async (req, res) => {
    try {
        const inviteId = req.params.id;
        const invite = await InviteTeam.findById(inviteId)
        if (!invite) return res.status(404).json('Invite not found')
        if (invite.senderId != req.userId && invite.invitedUser != req.userId) return res.status(401).json('You are not sender or invited user');
        await InviteTeam.findByIdAndDelete(inviteId)
        res.status(200).json('Invite canceled')
    } catch (error) {
        res.status(500).json(error)
    }
}