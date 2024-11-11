import { v2 as cloudinary } from "cloudinary"
// import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: "uploads", // Folder name in Cloudinary
//         allowed_formats: ["jpg", "png", "jpeg"], // Specify allowed formats
//         transformation: [{ width: 500, height: 500, crop: "limit" }] // Optional transformations
//     },
// });

// export default storage

const uploadAvatarCloudinary = async (buffer) => {
    return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder: "uploads", // Folder name in Cloudinary
        },
            (error, result) => {
                return resolve(result)
            }
        ).end(buffer)
    })
}

export default uploadAvatarCloudinary