import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const verifyLogin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json('Unauthorized')
        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(401).json('Token is not valid')
            const user = await User.findById(data.id)
            if (!user) return res.status(401).json('User not found')
            req.userId = data.id;
            req.userRole = user.role
            return next()
        })
    } catch (error) {
        console.log(error)
    }
}