import { useState } from "react"
import axios from "axios"
import api from "../api/axios"

export default function CreateRecord({ handleNavigate }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        title: "",
        category: "",
        amount: "",
        paymentMethod: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const categories = [
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
    ]

    const paymentMethods = [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "UPI",
        "Wallet",
        "Others",
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const token = localStorage.getItem("token")
        if (!token) {
            setError("Unauthorized access: Login and try again")
            setLoading(false)
            return
        }

        try {
            const response = await api.post(
                "/api/v1/records/create/",
                {
                    date: formData.date,
                    title: formData.title,
                    category: formData.category,
                    amount: parseFloat(formData.amount),
                    paymentMethod: formData.paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setSuccess(response.data.message)
            setFormData({
                date: new Date().toISOString().split("T")[0],
                title: "",
                category: "",
                amount: "",
                paymentMethod: "",
            })

            setTimeout(() => handleNavigate("/dashboard"), 1500)
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to create record"
            console.log(error.response)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="record-form-container">
            <h2>Create Expense Record</h2>
            {success && <p className="success-msg">{success}</p>}
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} className="record-form">
                <div className="form-input">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Expense Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-input">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Creating..." : "Create Record"}
                </button>
            </form>
        </div>
    )
}
