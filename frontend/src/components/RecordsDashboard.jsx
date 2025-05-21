import { useState, useEffect } from "react"
import axios from "axios"
import api from "../api/axios"

export default function RecordsDashboard({ handleNavigate }) {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        if (!token) {
            setError("Please log in to view your dashboard.")
            setLoading(false)
            handleNavigate("/login")
            return
        }

        try {
            const response = await api.get("/api/v1/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setDashboardData(response.data.data)
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch dashboard data."
            setError(errorMessage)
            if (err.response?.status === 401) {
                localStorage.removeItem("token")
                handleNavigate("/login")
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="dashboard-container">Loading dashboard...</div>
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error-msg">{error}</p>
            </div>
        )
    }

    if (!dashboardData) return null

    const {
        userWallet,
        totalNumberOfRecords,
        totalAmountSpent,
        categoryWiseRecords,
        paymentMethodWiseRecords,
    } = dashboardData

    return (
        <div className="dashboard-container">
            <h2>Expense Dashboard</h2>

            {/* Wallet Info */}
            <div className="dashboard-section">
                <h3>Wallet</h3>
                <p>Wallet Name: {userWallet.walletName}</p>
                <p>Balance: ₹{userWallet.balance}</p>
            </div>

            {/* Summary */}
            <div className="dashboard-section">
                <h3>Summary</h3>
                <p>Total Records: {totalNumberOfRecords}</p>
                <p>Total Amount Spent: ₹{totalAmountSpent.toFixed(2)}</p>
            </div>

            {/* Category Breakdown */}
            <div className="dashboard-section">
                <h3>Category Breakdown</h3>
                {categoryWiseRecords.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Total Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryWiseRecords.map((cat) => (
                                <tr key={cat._id}>
                                    <td>{cat._id}</td>
                                    <td>{cat.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No category data available.</p>
                )}
            </div>

            {/* Payment Method Breakdown */}
            <div className="dashboard-section">
                <h3>Payment Method Breakdown</h3>
                {paymentMethodWiseRecords.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Payment Method</th>
                                <th>Total Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentMethodWiseRecords.map((method) => (
                                <tr key={method._id}>
                                    <td>{method._id}</td>
                                    <td>{method.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No payment method data available.</p>
                )}
            </div>

            <button
                className="add-record-btn"
                onClick={() => handleNavigate("/records/create")}
            >
                Add New Record
            </button>
        </div>
    )
}
