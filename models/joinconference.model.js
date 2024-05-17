import mongoose from "mongoose";

const joinConference = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    conferenceId: {
        type: String,
        required: true
    }
})

const JoinConference = mongoose.model('JoinConference', joinConference)

export default JoinConference;