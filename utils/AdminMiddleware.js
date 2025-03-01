import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json('Unauthorized')
        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(401).json('Token is not valid')
            const user = await User.findById(data.id)
            if (user?.role === 'admin') {
                req.userId = data.id
                return next()
            }
            return res.status(401).json('You are not admin')
        })
    } catch (error) {
        console.log(error)
    }
}