import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/connectDB.js"

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

app.get("/", (req, res) => {
    res.json({ "msg": "Hello world! My app is running!" })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    })
})

