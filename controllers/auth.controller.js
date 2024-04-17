import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const validUser = await User.findOne({ username })
        if (!validUser) return res.status(404).json("User not found")
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return res.status(401).json("Wrong credentials")
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...userInfo } = validUser._doc
        const sendData = {
            token,
            ...userInfo
        }
        res.status(200).json(sendData)
    } catch (error) {
        res.status(500)
    }
}

export const register = async (req, res) => {
    try {
        const { username, email, password, ...userInfo } = req.body
        const validUser = await User.findOne({ username })
        if (validUser) return res.status(409).json("User exists")
        const validEmail = await User.findOne({ email })
        if (validEmail) return res.status(409).json("Mail exists")
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new User({ ...userInfo, password: hashedPassword, username, email })
        await newUser.save().catch(err => res.status(500).json(err))
        const { password: newUserPass, ...newUserInfo } = newUser._doc
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, ...newUserInfo })
    } catch (error) {
        res.status(500)
    }
}