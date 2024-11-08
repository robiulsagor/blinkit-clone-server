import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/connectDB.js"
import userRoute from "./routes/user.route.js"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
app.use(helmet({
    contentSecurityPolicy: false,
}))
app.use(morgan('tiny'))

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.json({ "msg": "Hello world! My app is running!" })
})

app.use("/api/user", userRoute)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    })
})

