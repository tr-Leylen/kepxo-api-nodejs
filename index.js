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
import buyHotelRoutes from './routes/buyhotel.route.js'
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
import { fileURLToPath } from "url"
import Photo from "./models/photo.model.js"
import { verifyLogin } from "./utils/LoginMiddleware.js"
import { MongoClient } from "mongodb"
import { socketMiddleware } from "./utils/socketMiddleware.js"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIR || 'uploads');

if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('UPLOADS FOLDER CREATED')
    } catch (error) {
        console.log(error)
    }
} else {
    console.log(uploadsDir)
}

console.log(`Directory exists: ${fs.existsSync(uploadsDir)}`);
try {
  // Try to write a test file
  fs.writeFileSync(`${uploadsDir}/test.txt`, 'test');
  console.log('Successfully wrote test file');
  fs.unlinkSync(`${uploadsDir}/test.txt`);
  console.log('Successfully deleted test file');
} catch (e) {
  console.log(`Permission error: ${e.message}`);
}

dotenv.config()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage })
const port = 4000
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
app.use(cors())

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

await mongoose.connect(process.env.MONGO, {
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
}).then(() => console.log('DB Connected')).catch(err => console.log(err));

export const userSockets = {}
io.on('connection', (socket) => {
    let user_id;
    socket.on('register', (userId) => {
        user_id = userId
        userSockets[userId] = socket.id;
    })

    socket.on('disconnect', () => {
        delete userSockets[user_id]
    })
})


app.use("/api/auth", authRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/buycourse", buycourseRoutes)
app.use("/api/team", teamRoutes)
app.use("/api/user", userRoutes)
app.use("/api/likecourse", likeCourseRoutes)
app.use("/api/follow", socketMiddleware(io), followRoutes)
app.use("/api/blockuser", blockUserRoutes)
app.use("/api/commentuser", commentUserRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)
app.use("/api/likepost", socketMiddleware(io), likePostRoutes)
app.use("/api/likeuser", likeUserRoutes)
app.use("/api/buygift", buyGiftRoutes)
app.use("/api/buyhotel", buyHotelRoutes)
app.use("/api/gift", giftRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/gifttype", giftTypeRoutes)
app.use("/api/hotel", hotelRoutes)
app.use("/api/conference", conferenceRoutes)
app.use("/api/join-conference", joinconferenceRoutes)
app.use("/api/starcourse", starCourseRoutes)
app.use("/api/saved-card", savedCardRoutes)
app.use("/api/invite-team", inviteTeamRoutes)



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/api/photo', upload.single('file'), verifyLogin, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json("File upload failed");
        }
        await Photo.create({
            userId: req.userId,
            fileName: req.file?.filename,
            url: `${process.env.APP_URL}uploads/${req.file?.filename}`
        })
        res.json({
            message: 'File uploaded successfully',
            file: req.file,
            url: `${process.env.APP_URL}uploads/${req.file?.filename}`
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

server.listen(port, () => console.log(`backend running on ${port} port`))