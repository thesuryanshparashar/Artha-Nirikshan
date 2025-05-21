import { useState, useEffect } from "react"
import axios from "axios"
import api from "../api/axios"

export default function AnnualRecords({ handleNavigate }) {
    const [annualRecords, setAnnualRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchAnnualRecords()
    }, [])

    const fetchAnnualRecords = async () => {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        if (!token) {
            setError("Please log in to view your annual records.")
            setLoading(false)
            handleNavigate("/login")
            return
        }

        try {
            const response = await api.get("/api/v1/dashboard/annual", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setAnnualRecords(response.data.data.annualRecords)
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch annual records."
            console.log("Error fetching annual records: ", err.response)
            setError(errorMessage)
            if (err.response?.status === 401) {
                localStorage.removeItem("token")
                handleNavigate("/login")
            }
        } finally {
            setLoading(false)
        }
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const formatIndianNumber = (amount) => {
        return amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    if (loading) {
        return (
            <div className="annual-records-container">
                Loading annual records...
            </div>
        )
    }

    if (error) {
        return (
            <div className="annual-records-container">
                <p className="error-msg">{error}</p>
            </div>
        )
    }

    return (
        <div className="annual-records-container">
            <h2>Annual Expense Records</h2>
            {annualRecords.length === 0 ? (
                <p className="no-records-msg">No annual records found.</p>
            ) : (
                <table className="annual-records-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Month</th>
                            <th>Total Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annualRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record._id.year}</td>
                                <td>{monthNames[record._id.month - 1]}</td>
                                <td>
                                    ₹{" "}
                                    {formatIndianNumber(
                                        record.totalAmount
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="back-btn" onClick={() => handleNavigate("/")}>
                Back to Home
            </button>
        </div>
    )
}
