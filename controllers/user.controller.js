import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking if any required field is missing
        if (!name || !email || !password) {
            return res.json({
                message: "Name, email and password are required!",
                error: true,
                success: false
            })
        }

        // check if user already exists
        const isExists = await UserModel.findOne({ email })
        if (isExists) {
            return res.json({
                message: "User already exists!",
                error: true,
                success: false
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const data = {
            name, email, password: hash
        }

        const newUser = new UserModel(data)
        const saved = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${saved?._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify your email",
            body: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        res.status(201).json({
            message: "User created successfully",
            error: false,
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

const verifyUser = async (req, res) => {
    const { code } = req.body

    const user = await UserModel.findOne({ _id: code })
    if (!user) {
        return res.status(404).json({
            message: "Code error",
            error: true,
            success: false
        })
    }

    await UserModel.findOneAndUpdate({ _id: code }, {
        $set: {
            email_verified: true
        }
    }, {
        new: true
    })

    return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true
    })
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                message: "Email and password are required!",
                error: true,
                success: false
            })
        }

        // check if user found
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({
                message: "User not found!",
                error: true,
                success: false
            })
        }

        // check if user is inactive or suspended
        if (user?.status !== "Active") {
            return res.json({
                message: `User is ${user?.status}, Contact to Admin.`,
                error: true,
                success: false
            })
        }

        // if user not verified email
        if (!user?.email_verified) {
            return res.json({
                message: `Email not verified. Please verify email`,
                error: true,
                success: false
            })
        }

        const checkPass = await bcrypt.compare(password, user.password)
        if (!checkPass) {
            return res.status(400).json({
                message: "Email or Password is incorrect",
                error: true,
                success: false
            })
        }

        await UserModel.findOneAndUpdate({ _id: user?._id }, { last_login_date: Date.now() })

        const accessToken = generateAccessToken(user?._id)
        const refreshToken = await generateRefreshToken(user?._id)

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        res.cookie("accessToken", accessToken, cookieOptions)
        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.json({
            message: "Logged In successfully!",
            error: false,
            success: true,
            data: {
                accessToken, refreshToken
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

const userLogouot = async (req, res) => {
    try {
        const userId = req.userId

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        await UserModel.findOneAndUpdate({ _id: userId }, { refresh_token: "" })

        res.status(500).json({
            message: "Logout Successful",
            error: false,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

export { userRegister, verifyUser, userLogin, userLogouot }