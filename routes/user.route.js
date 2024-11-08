import express from "express"
import { userRegister, verifyUser } from "../controllers/user.controller.js";
const router = express.Router()

router.post("/register", userRegister)
router.post("/verify-email", verifyUser)


export default router;