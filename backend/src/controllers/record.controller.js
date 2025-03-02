import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Record } from "../models/record.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Wallet } from "../models/wallet.model.js"
import moment from "moment"

const createRecord = asyncHandler(async (req, res) => {
    const { date, title, category, amount, paymentMethod } = req.body

    if (amount < 0) {
        throw new ApiError(400, "Amount cannot be negative")
    }

    // const formattedDate = moment(date, "DD-MM-YYYY").format("DD-MM-YYYY HH:mm:ss").toISOString()
    // console.log(formattedDate)

    const session = await mongoose.startSession()
    session.startTransaction()

    console.log("Transaction started")

    try {
        let wallet

        if (paymentMethod === "Wallet") {
            wallet = await Wallet.findOne({ owner: req.user._id }).session(
                session
            )

            if (!wallet) {
                throw new ApiError(404, "Wallet not found")
            }

            wallet.deductBalance(amount)

            await wallet.save({ session })
        }

        console.log("Creating record")

        const record = await Record.create(
            [{ 
                ...req.body,
                owner: req.user._id
            }],
            { session }
        )

        console.log("record created")
        // console.log(record)

        if (!record || record.length === 0) {
            throw new ApiError(400, "Record creation failed")
        }

        await session.commitTransaction()
        session.endSession()

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { record: record[0] },
                    "Record created successfully"
                )
            )
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(500, "Record creation failed: " + error.message)
    }
})

const getUserRecords = asyncHandler(async (req, res) => {
    const userId = req.user._id
    // console.log(userId)

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const records = await Record.find({ owner: userId }).sort({ createdAt: -1 })

    if (!records || records.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No records found"))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, records, "User records retrieved successfully")
        )
})

const deleteRecord = asyncHandler(async (req, res) => {
    const { recordId } = req.params

    if (!isValidObjectId(recordId)) {
        throw new ApiError(400, "Invalid record ID")
    }

    const record = await Record.findById(recordId)

    if (!record) {
        throw new ApiError(404, "Record not found")
    }

    if (record.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this record")
    }

    await record.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Record deleted successfully"))
})

const deleteAllRecords = asyncHandler(async (req, res) => {
    const allRecords = await Record.deleteMany({ owner: req.user._id })

    if (!allRecords) {
        throw new ApiError(500, "Record deletion failed")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "All records deleted successfully"))
})

export { createRecord, getUserRecords, deleteRecord, deleteAllRecords }
