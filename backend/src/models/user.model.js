import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { Wallet } from "./wallet.model.js"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,
            default: "https://www.gravatar.com/avatar/?d=mp",
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
)

userSchema.post("save", async function (doc, next) {
    try {
        await Wallet.create({ owner: doc._id })
        next()
    } catch (error) {
        console.error("Error creating wallet", error)
        next(error)
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!password || !this.password) {
        throw new ApiError(400, "Password is required")
    }

    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)
