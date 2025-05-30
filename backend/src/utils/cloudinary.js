import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        console.log("Uploading image to Cloudinary...")
        console.log("Local file path:", localFilePath)

        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Artha-Nirikshan",
            resource_type: "image",
        })

        console.log("Image uploaded successfully!")
        console.log(response)

        if (fs.existsSync(localFilePath)) {
            console.log("Deleting local file after upload...")
            fs.unlinkSync(localFilePath)
        }

        return response

    } catch (error) {
        console.error(error)

        if (fs.existsSync(localFilePath)) {
            console.log("Error occurred, deleting local file...")
            fs.unlinkSync(localFilePath)
        }

        return null
    }
}

export { uploadOnCloudinary }