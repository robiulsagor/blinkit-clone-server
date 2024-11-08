import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

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

export { userRegister }