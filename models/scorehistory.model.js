import mongoose from 'mongoose'

const scoreHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    courseScore: {
        type: String,
        required: true
    }
})

const ScoreHistory = mongoose.model('ScoreHistory', scoreHistorySchema)

export default ScoreHistory;