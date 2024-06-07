import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Team'
    },
    members: {
        type: Array
    },
    creatorId: {
        type: String,
        required: true
    }
})

const Team = mongoose.model('Team', teamSchema)

export default Team;