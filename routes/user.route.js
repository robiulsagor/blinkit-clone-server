import express from "express"
import { userRegister, verifyUser, userLogin, userLogouot } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
const router = express.Router()

router.post("/register", userRegister)
router.post("/verify-email", verifyUser)
router.post("/login", userLogin)
router.get("/logout", auth, userLogouot)


export default router;