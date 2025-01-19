import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

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
        }).catch((error) => {
            console.error(error)
            fs.unlinkSync(localFilePath)
        })
        console.log("Image uploaded successfully!")
        console.log(response)

        fs.unlinkSync(localFilePath)

        return response

    } catch (error) {
        console.error(error)
        fs.unlinkSync(localFilePath)
    }
}

export { uploadOnCloudinary }