import { useState, useEffect } from "react"
import api from "../api/axios"
import formatIndianNumber from "../utils/FormatIndianNumber.js"
import closeIcon from "../assets/close.svg"
import editIcon from "../assets/edit.svg"

export default function RecordsDashboard({ handleNavigate }) {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isWalletModalOpen, setWalletModalOpen] = useState(false)

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

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                setWalletModalOpen(false)
                setError("")
            }
        }
        document.addEventListener("keydown", handleEsc)
        return () => document.removeEventListener("keydown", handleEsc)
    }, [setWalletModalOpen])

    const changeWalletName = async (e) => {
        e.preventDefault()
        const newWalletName = e.target[0].value.trim()

        if (!newWalletName) {
            setError("Wallet name cannot be empty.")
            return
        }

        const confirmed = confirm(
            `Are you sure you want to change the wallet name to "${newWalletName}"?`
        )
        if (!confirmed) {
            return
        }

        setLoading(true)
        setError("")
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Please log in to continue.")
                return
            }

            await api.patch(
                "/api/v1/wallet/change-wallet-name/",
                { walletName: newWalletName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchDashboardData()
            setWalletModalOpen(false)
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update wallet name."
            )
        } finally {
            setLoading(false)
        }
    }

    const addToWalletBalance = async (e) => {
        e.preventDefault()
        const amountToAdd = parseFloat(e.target[0].value)
        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            setError("Please enter a valid amount to add.")
            return
        }

        const confirmed = confirm(
            `Are you sure you want to add ₹${amountToAdd.toFixed(
                2
            )} to your wallet?`
        )
        if (!confirmed) {
            return
        }

        setLoading(true)
        setError("")
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Please log in to continue.")
                return
            }

            await api.patch(
                "/api/v1/wallet/add-balance/",
                { amount: amountToAdd },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchDashboardData()
            setWalletModalOpen(false)
            e.target.reset()
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to add to wallet balance."
            )
        } finally {
            setLoading(false)
        }
    }

    const resetWallet = async (e) => {
        e.preventDefault()
        const confirmed = confirm(
            "Are you sure you want to reset your wallet? This action cannot be undone."
        )
        if (!confirmed) {
            return
        }

        setLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Please log in to continue.")
                return
            }

            await api.post(
                "/api/v1/wallet/delete-wallet",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchDashboardData()
            setWalletModalOpen(false)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset wallet.")
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
        <section className="dashboard-container">
            <h2>Expense Dashboard</h2>

            <div
                className="dashboard-section card-container"
                id="summary-cards"
            >
                {/* Wallet Info */}
                <div className="dashboard-section-item card" id="wallet-info">
                    <div className="accent-layer"></div>
                    <h3>{userWallet.walletName}</h3>
                    <p>Balance: ₹{formatIndianNumber(userWallet.balance)}</p>
                    <span className="edit-wallet">
                        <button onClick={() => setWalletModalOpen(true)}>
                            <img src={editIcon} alt="Edit Wallet" height="25px"/>
                        </button>
                    </span>
                </div>

                {isWalletModalOpen && (
                    <div id="wallet-modal">
                        <div className="modal-content">
                            <h3>Edit Wallet</h3>
                            <form
                                className="wallet-modal-form form-input"
                                onSubmit={changeWalletName}
                            >
                                <label htmlFor="wallet-name">
                                    New Wallet Name:
                                </label>
                                <input
                                    type="text"
                                    name="wallet-name"
                                    id="wallet-name"
                                    placeholder={userWallet.walletName}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="wallet-update-btn"
                                >
                                    Update Wallet Name
                                </button>
                            </form>
                            <form
                                className="wallet-modal-form form-input"
                                onSubmit={addToWalletBalance}
                            >
                                <label htmlFor="wallet-balance">
                                    Add Balance:
                                </label>
                                <input
                                    type="number"
                                    name="wallet-balance"
                                    placeholder={userWallet.balance}
                                    required
                                    disabled={loading}
                                    min="1"
                                    id="wallet-balance"
                                />
                                <button
                                    type="submit"
                                    className="wallet-update-btn"
                                >
                                    Update Wallet Balance
                                </button>
                            </form>
                            <button
                                className="close-modal-btn"
                                onClick={() => setWalletModalOpen(false)}
                            >
                                <img
                                    src={closeIcon}
                                    alt="Close Modal"
                                    className="close-icon"
                                />
                            </button>
                            <button
                                type="submit"
                                className="wallet-reset-btn"
                                onClick={resetWallet}
                            >
                                Reset Wallet
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="dashboard-section-item card" id="summary">
                    <div className="accent-layer"></div>
                    <h3>Summary</h3>
                    <p>Total Records: {totalNumberOfRecords}</p>
                    <p>
                        Total Amount Spent: ₹
                        {formatIndianNumber(totalAmountSpent)}
                    </p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="dashboard-section">
                <h3>Category Breakdown</h3>
                <hr />

                {categoryWiseRecords.length > 0 ? (
                    <div className="card-container">
                        {categoryWiseRecords.map((cat) => (
                            <div className="card" key={cat._id}>
                                <div className="accent-layer"></div>
                                <h3>{cat._id}</h3>
                                <p>₹{formatIndianNumber(cat.totalAmount)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No category data available.</p>
                )}
            </div>

            {/* Payment Method Breakdown */}
            <div className="dashboard-section">
                <h3>Payment Method Breakdown</h3>
                <hr />

                {paymentMethodWiseRecords.length > 0 ? (
                    <div className="card-container">
                        {paymentMethodWiseRecords.map((method) => (
                            <div className="card" key={method._id}>
                                <div className="accent-layer"></div>
                                <h3>{method._id}</h3>
                                <p>₹{formatIndianNumber(method.totalAmount)}</p>
                            </div>
                        ))}
                    </div>
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
        </section>
    )
}
