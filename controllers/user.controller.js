import UserModel from "../models/user.model";
import bcrypt from "bcryptjs"

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            return res.json({
                message: "Name, email and password are required!",
                error: true,
                success: false
            })
        }

        const isExists = await UserModel.findOne({ email })
        if (isExists) {
            return res.json({
                message: "User already exists!",
                error: true,
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const data = {
            name, email, password: hash
        }

        const newUser = new UserModel(data)
        const saved = await newUser.save()

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