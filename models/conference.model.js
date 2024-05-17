import mongoose from 'mongoose'

const conferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        type: String
    },
    link: {
        type: String
    },
    speakers: {
        type: Array,
        required: true
    }
})

const Conference = mongoose.model('Conference', conferenceSchema)

export default Conference;