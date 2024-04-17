import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json('Unauthorized')
        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(403).json('Token is not valid')
            const user = await User.findById(data.id)
            if (data.id !== req.params.id && user?.role != 'admin') return res.status(403).json('Permission denied')
            req.userId = data.id
            return next()
        })
    } catch (error) {
        console.log(error)
    }
}