import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    }
})

const Hotel = mongoose.model("Hotel", hotelSchema)

export default Hotel;