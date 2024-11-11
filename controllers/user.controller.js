import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import uploadAvatarCloudinary from "../utils/uploadImage.js"
import { generateOtp } from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

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

const userLogout = async (req, res) => {
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

const userUploadAvatar = async (req, res) => {
    try {
        const userId = req.userId
        const image = req.file

        await uploadAvatarCloudinary(image.buffer)

        // update avatar field
        const user = await UserModel.findByIdAndUpdate(userId.id, {
            avatar: image.url
        }, { new: true })

        return res.json({
            message: "Avatar Uploaded",
            data: {
                _id: user._id,
                avatar: user.avatar
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

const userProfileUpdate = async (req, res) => {
    try {
        const userId = req.userId
        const { name, email, mobile, password } = req.body

        const dataToUpdate = {}

        if (name !== undefined) dataToUpdate.name = name
        if (email !== undefined) dataToUpdate.email = email
        if (mobile !== undefined) dataToUpdate.mobile = mobile
        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            dataToUpdate.password = hash
        }

        const updated = await UserModel.findByIdAndUpdate(userId.id, dataToUpdate, {
            new: true,
            runValidators: true
        })

        return res.status(200).json({
            message: "Profile updated",
            data: updated
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(500).json({
                message: "Email not found!",
                error: true,
                success: false
            })
        }

        const otp = generateOtp()
        const otpExp = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()

        // send opt email
        await sendEmail({
            sendTo: email,
            subject: "Forget password",
            body: forgotPasswordTemplate({
                name: user.name,
                otp: otp,
            })
        })

        // save otp and exp in db
        const updateUserOpt = await UserModel.findOneAndUpdate({ email }, {
            forgot_password_otp: otp,
            forgot_password_expiry: otpExp
        },
            { new: true }
        )

        return res.status(200).json({
            message: "Send opt in email",
            updateUserOpt,
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

const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body

        // check if email and otp are sent
        if (!email || !otp) {
            return res.status(500).json({
                message: "Please provide email and otp",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(500).json({
                message: "User not found!",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(500).json({
                message: "OTP not matched!",
                error: true,
                success: false
            })
        }

        const expOtpTime = user.forgot_password_expiry
        const currentTime = new Date()

        if (expOtpTime <= currentTime) {
            return res.status(400).json({
                message: "OTP expired!",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        }, { new: true })

        return res.status(200).json({
            message: "Verify otp successfully",
            error: false,
            success: true,
            updateUser
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "newPassword and confirmPassword must be same.",
                error: true,
                success: false,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)

        await UserModel.findOneAndUpdate(user._id, {
            password: hash
        })

        return res.json({
            message: "Password updated successfully.",
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

export { userRegister, verifyUser, userLogin, userLogout, userUploadAvatar, userProfileUpdate, forgotPasswordController, verifyOtpController, updatePassword }