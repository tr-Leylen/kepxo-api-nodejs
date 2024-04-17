import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    notificationTo: {
        type: String,
        required: true
    },
    notificationFrom: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        required: true
    }
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification;