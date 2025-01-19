import mongoose, { Schema } from "mongoose"

const recordSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
          type: String,
          enum: ["Bills", "Education", "Entertainment", "Food", "Health", "Shopping", "Transport", "Others"],
          required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Others"],
            required: true,
        },
    },
    { timestamps: true }
)

export const Record = mongoose.model("Record", recordSchema)

/*
// Aggregation Pipeline Suggestions:

Based on your expense record schema, here are some aggregation pipelines you can use for your expense tracker project:


    Total Expenses by Category: This pipeline calculates the total amount spent in each expense category.

    const pipeline = [
      {
        $group: {
          _id: "$category",
          totalAmount: {
            $sum: "$amount"
          }
        }
      }
    ];


Total Expenses by User: This pipeline calculates the total amount spent by each user.

const pipeline = [
  {
    $group: {
      _id: "$owner",
      totalAmount: { $sum: "$amount" }
    }
  }
];


Monthly Expenses: This pipeline calculates the total amount spent each month.

const pipeline = [
  {
    $group: {
      _id: { month: { $month: "$date" }, year: { $year: "$date" } },
      totalAmount: { $sum: "$amount" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 }
  }
];


Average Expense per Category: This pipeline calculates the average amount spent in each expense category.

const pipeline = [
  {
    $group: {
      _id: "$category",
      averageAmount: { $avg: "$amount" }
    }
  }
];


Expenses by Payment Method: This pipeline calculates the total amount spent using each payment method.

const pipeline = [
  {
    $group: {
      _id: "$paymentMethod",
      totalAmount: { $sum: "$amount" }
    }
  }
];



To execute these pipelines, you can use the aggregate method in your Node.js application. For example:

const expenses = db.collection('records');
// Total Expenses by Category
expenses.aggregate([
  {
    $group: {
      _id: "$category",
      totalAmount: { $sum: "$amount" }
    }
  }
]).toArray((err, result) => {
  if (err) throw err;
  console.log(result);
});

You can adjust these pipelines based on your specific requirements and the structure of your documents.
*/
