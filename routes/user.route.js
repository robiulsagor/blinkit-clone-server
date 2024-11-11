import express from "express"
import { userRegister, verifyUser, userLogin, userLogout, userUploadAvatar } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router()


router.post("/register", userRegister)
router.post("/verify-email", verifyUser)
router.post("/login", userLogin)
router.get("/logout", auth, userLogout)
router.put('/upload-avatar', auth, upload.single('avatar'), userUploadAvatar)


export default router;