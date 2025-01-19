import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { Record } from "../models/record.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Wallet } from "../models/wallet.model.js"

const recordsDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const wallet = await Wallet.findOne({ owner: userId })
    if (!wallet) {
        throw new ApiError(404, "Wallet not found")
    }

    const userWallet = {
        walletName: wallet.walletName,
        balance: wallet.balance.toFixed(2),
    }

    const totalNumberOfRecords = await Record.countDocuments({ owner: userId })

    const totalAmountSpent = await Record.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: {
                    $sum: "$amount",
                },
            },
        },
    ])

    const categoryWiseRecords = await Record.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: "$category",
                totalAmount: {
                    $sum: "$amount",
                },
            },
        },
    ])

    const paymentMethodWiseRecords = await Record.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: "$paymentMethod",
                totalAmount: {
                    $sum: "$amount",
                },
            },
        },
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userWallet,
                totalNumberOfRecords,
                totalAmountSpent: totalAmountSpent[0]?.totalAmount || 0,
                categoryWiseRecords,
                paymentMethodWiseRecords,
            },
            "Records categorized successfully"
        )
    )
})

const annualRecords = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const annualRecords = await Record.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$date",
                    },
                    year: {
                        $year: "$date",
                    },
                },
                totalAmount: {
                    $sum: "$amount",
                },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                annualRecords,
            },
            "Annual records retrieved successfully"
        )
    )
})

export { recordsDashboard, annualRecords }
