import Notification from "../models/notification.model.js"


export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id
        const userId = req.userId
        const notification = await Notification.findById(notificationId)
        if (!notification) return res.status(404).json('Notification not found')
        if (notification.notificationTo != userId) return res.status(403).json('You can delete only your notifications')
        await Notification.findByIdAndDelete(notificationId)
        res.status(200).json('Notification deleted')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}