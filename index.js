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

dotenv.config()
const port = 4000
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
// app.use(cors())

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

server.listen(port, () => console.log(`backend running on ${port} port`))