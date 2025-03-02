import mongoose, { Schema } from "mongoose"
import { ApiError } from "../utils/ApiError.js"

const walletSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        walletName: {
            type: String,
            default: "Wallet",
        },
        balance: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

walletSchema.methods.addBalance = async function (amount) {
    this.balance += amount
    await this.save()
}

walletSchema.methods.deductBalance = async function (amount) {
    if (this.balance < amount) {
        throw new ApiError("Insufficient balance")
    }

    this.balance -= amount
}

export const Wallet = mongoose.model("Wallet", walletSchema)
