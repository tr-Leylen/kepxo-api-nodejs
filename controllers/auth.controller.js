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
        if (req.body.role === 'admin') return res.status(403).json('You dont set admin himself')
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
            service: 'gmail',
            auth: {
                user: 'elturanfcb@gmail.com',
                pass: 'zxhf mfkw uvnl iuwe'
            }
        })
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).json('User not found');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        const mailOptions = {
            from: 'elturanfcb@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `${process.env.APP_URL}/reset-password/${token}`,
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json('Mail send')
    } catch (error) {
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