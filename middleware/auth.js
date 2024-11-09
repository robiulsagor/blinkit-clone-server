import jwt from "jsonwebtoken"


const auth = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]

        if (!token) {
            return res.status(500).json({
                message: "Please provide your token",
                error: true,
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (!decoded) {
            return res.status(500).json({
                message: "Please provide valid token",
                error: true,
                success: false
            })
        }

        req.userId = decoded
        next()
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default auth