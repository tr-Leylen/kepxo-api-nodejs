import mongoose from "mongoose";

const inviteTeamSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    invitedUser: {
        type: String,
        required: true
    }
})

const InviteTeam = mongoose.model('InviteTeam', inviteTeamSchema)

export default InviteTeam;