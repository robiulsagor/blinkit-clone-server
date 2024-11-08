import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '5h' });
}

const generateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

    try {
        await UserModel.findOneAndUpdate({ _id: userId }, { refresh_token: refreshToken }, { new: true });
    } catch (error) {
        console.log(error);
    }

    return refreshToken
}

export { generateAccessToken, generateRefreshToken }