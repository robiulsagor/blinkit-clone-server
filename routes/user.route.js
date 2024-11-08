import express from "express"
import { userRegister, verifyUser, userLogin } from "../controllers/user.controller.js";
const router = express.Router()

router.post("/register", userRegister)
router.post("/verify-email", verifyUser)
router.post("/login", userLogin)


export default router;