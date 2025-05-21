import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false,
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Token generation failed")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password, avatar } = req.body

    if (
        [username, email, fullName, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path

    // let avatarLocalPath
    // if (
    //     req.files &&
    //     Array.isArray(req.files.avatar) &&
    //     req.files.avatar.length > 0
    // ) {
    //     avatarLocalPath = req.files.avatar[0].path
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if (!avatar) {
    //     throw new ApiError(500, "Avatar upload failed")
    // }

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar?.url,
    })

    const createdUser = await User
        .findById(user._id)
        .select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "User registration failed")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    )

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access Token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isCurrentPasswordCorrect =
        await user.isPasswordCorrect(currentPassword)

    if (!isCurrentPasswordCorrect) {
        throw new ApiError(401, "Invalid current password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: true })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "User details fetched successfully")
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, email, fullName } = req.body

    if (!username && !email && !fullName) {
        throw new ApiError(400, "No fields to update")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username.toLowerCase(),
                email,
                fullName,
            },
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "No avatar file uploaded")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)

    if (!avatar.secure_url) {
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar?.secure_url,
            },
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

export {
    generateAccessAndRefreshToken,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getUser,
    updateAccountDetails,
    updateUserAvatar,
}
