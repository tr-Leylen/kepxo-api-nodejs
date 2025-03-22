import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        required: true
    }
})

const Photo = mongoose.model('Photo', photoSchema)

export default Photo;