import multer from "multer"
import storage from "../utils/uploadImage.js";

const upload = multer({ storage: storage });

export default upload;