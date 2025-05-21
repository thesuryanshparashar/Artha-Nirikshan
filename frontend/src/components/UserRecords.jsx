import { useState, useEffect } from "react"
import axios from "axios"
import api from "../api/axios"

export default function UserRecords({ handleNavigate }) {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetchRecords()
    }, [])

    const fetchRecords = async () => {
        setLoading(true)
        setError("")
        setMessage("")

        const token = localStorage.getItem("token")
        if (!token) {
            setError("Please log in to view your records.")
            setLoading(false)
            handleNavigate("/login")
            return
        }

        try {
            const response = await api.get("/api/v1/records", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const { data, message } = response.data
            setRecords(data)
            setMessage(data.length === 0 ? message : "")
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch records."
            setError(errorMessage)
            if (err.response?.status === 401) {
                localStorage.removeItem("token")
                handleNavigate("/login")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="records-container">
            <h2>Your Expense Records</h2>
            {loading && <p className="loading-msg">Loading records...</p>}
            {error && <p className="error-msg">{error}</p>}
            {message && !records.length && (
                <p className="info-msg">{message}</p>
            )}
            {records.length > 0 && (
                <table className="records-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record._id}>
                                <td>
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td>{record.title}</td>
                                <td>{record.category}</td>
                                <td>₹{record.amount.toFixed(2)}</td>
                                <td>{record.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button
                className="add-record-btn"
                onClick={() => handleNavigate("/records/create")}
            >
                Add New Record
            </button>
        </div>
    )
}
