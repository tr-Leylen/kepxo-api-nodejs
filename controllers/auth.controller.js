import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const APP_PASS = '216430'

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

export const forgotPassword = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            port: 465,
            host: 'smtp.gmail.com',
            auth: {
                user: 'elturanfcb@gmail.com',
                pass: APP_PASS
            }
        })
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).json('User not found');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://45.9.190.138:5173/forgot-password?token=${token}`

        const mailOptions = {
            from: 'elturanfcb@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`
        }

        await transporter.sendMail(mailOptions)
        console.log(token)
        res.status(200).json('Mail send')
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        await User.updateOne({ _id: decoded.userId }, { password: hashedPassword });
        res.status(200).json('Password reset')
    } catch (error) {
        res.status(500).json(error)
    }
}