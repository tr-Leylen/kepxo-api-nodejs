import mongoose from 'mongoose'

const scoreHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    }
})

const ScoreHistory = mongoose.model('ScoreHistory', scoreHistorySchema)

export default ScoreHistory;