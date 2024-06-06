import mongoose from "mongoose";

const savedCardSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const SavedCard = mongoose.model("SavedCard", savedCardSchema)

export default SavedCard;