import mongoose, { Schema } from "mongoose"

const recordSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            // type: String,
            type: Date,
            required: true,
            // default: `${Date.now}`,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "Bills",
                "Education",
                "Entertainment",
                "Food",
                "Health",
                "Shopping",
                "Transport",
                "Home",
                "Utilities",
                "Others",
            ],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "Credit Card",
                "Debit Card",
                "Net Banking",
                "UPI",
                "Wallet",
                "Others",
            ],
            required: true,
        },
    },
    { timestamps: true }
)


export const Record = mongoose.model("Record", recordSchema)
