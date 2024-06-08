import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { Server } from "socket.io"
import http from 'http'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import authRoutes from './routes/auth.route.js'
import courseRoutes from './routes/course.route.js'
import buycourseRoutes from './routes/buycourse.route.js'
import teamRoutes from './routes/team.route.js'
import userRoutes from './routes/user.route.js'
import likeCourseRoutes from './routes/likecourse.route.js'
import followRoutes from './routes/follow.route.js'
import blockUserRoutes from './routes/blockuser.route.js'
import commentUserRoutes from './routes/commentuser.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import likePostRoutes from './routes/likepost.route.js'
import likeUserRoutes from './routes/likeuser.route.js'
import buyGiftRoutes from './routes/buygift.route.js'
import giftRoutes from './routes/gift.route.js'
import Notification from "./models/notification.model.js"
import User from "./models/user.model.js"
import categoryRoutes from "./routes/category.route.js"
import giftTypeRoutes from "./routes/gifttype.route.js"
import hotelRoutes from "./routes/hotel.route.js"
import conferenceRoutes from "./routes/conference.route.js"
import joinconferenceRoutes from "./routes/joinconference.route.js"
import starCourseRoutes from "./routes/starcourse.route.js"
import savedCardRoutes from "./routes/saved_card.route.js"
import inviteTeamRoutes from "./routes/invite_team.route.js"
import multer from "multer"
import path from "path"
import fs from 'fs'
import { fileURLToPath } from "url"
import Photo from "./models/photo.model.js"
import { verifyLogin } from "./utils/LoginMiddleware.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS_DIR)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage })
const port = 4000
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
app.use(cors({
    origin: 'http://45.9.190.138:5173'
}))

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kepxo api documentations',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:4000/'
            }
        ],
        security: [{ bearerAuth: [] }]
    },
    apis: [
        './routes/*.js'
    ],
}

const swaggerSpec = swaggerJSDoc(options)

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose.connect(process.env.MONGO)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("DB conntection Error!"))

const connection = mongoose.connection;

// connection.once('open', (req, res) => {
//     console.log('DB connection is open')
//     const notificationChangeStream = Notification.watch()
//     notificationChangeStream.on('change', (change) => {
//         if (change.operationType === 'insert') {
//             const notification = change.fullDocument
//             io.emit('notification', notification)
//         }
//     })
// })

io.on('connection', (socket) => {

    socket.on('connect', () => { console.log('User connected') })

    const token = socket.handshake.headers.authorization?.split(" ")[1];
    let userId;
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) return console.log('Token is not valid')
        userId = data.id
        const user = await User.findById(userId)
        if (!user) console.log("user not found")
    })
    const notificationChangeStream = Notification.watch()
    notificationChangeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const notification = change.fullDocument
            if (notification.notificationTo === userId) {
                io.emit('notification', notification)
            }
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/buycourse", buycourseRoutes)
app.use("/api/team", teamRoutes)
app.use("/api/user", userRoutes)
app.use("/api/likecourse", likeCourseRoutes)
app.use("/api/follow", followRoutes)
app.use("/api/blockuser", blockUserRoutes)
app.use("/api/commentuser", commentUserRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)
app.use("/api/likepost", likePostRoutes)
app.use("/api/likeuser", likeUserRoutes)
app.use("/api/buygift", buyGiftRoutes)
app.use("/api/gift", giftRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/gifttype", giftTypeRoutes)
app.use("/api/hotel", hotelRoutes)
app.use("/api/conference", conferenceRoutes)
app.use("/api/join-conference", joinconferenceRoutes)
app.use("/api/starcourse", starCourseRoutes)
app.use("/api/saved-card", savedCardRoutes)
app.use("/api/invite-team", inviteTeamRoutes)


app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR)));
app.post("/api/photo", upload.single('file'), verifyLogin, async (req, res) => {
    await Photo.create({
        userId: req.userId,
        fileName: req.file?.filename,
        url: `${process.env.APP_URL}${process.env.UPLOADS_DIR + req.file?.filename}`
    })
    res.json({
        message: 'File uploaded successfully',
        file: req.file,
        url: `blob:${process.env.APP_URL}${process.env.UPLOADS_DIR + req.file?.filename}`
    })
})

// app.get("/api/photo/:fileName", async (req, res) => {
//     const { fileName } = req.params;
//     const photo = await Photo.findOne({ fileName })
//     if (!photo) return res.status(404).json('Photo not found');
//     res.status(200).json(photo.url)
// })

// app.delete('/api/uploads/:fileName', verifyLogin, async (req, res) => {
//     const { fileName } = req.params;
//     const filepath = path.join(__dirname, process.env.UPLOADS_DIR, fileName);
//     const photo = await Photo.findOne({ fileName })
//     if (!photo) return res.status(404).json('Photo not found');
//     if (photo.userId != req.userId && req.userRole != 'admin') return res.status(401).json('You can only delete your own photos')
//     fs.unlink(filepath, async (err) => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to delete file' });
//         }
//         await Photo.findByIdAndDelete(photo._id)
//         res.json({ message: 'File deleted successfully' });
//     });
// })

server.listen(port, () => console.log(`backend running on ${port} port`))