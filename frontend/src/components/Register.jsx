import { useState } from "react"
import axios from "axios"

export default function Register({ handleNavigate }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        avatar: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await axios.post("/api/v1/user/register", formData)
            setSuccess(response.data.message)
            setFormData({
                username: "",
                email: "",
                fullName: "",
                password: "",
                avatar: "",
            })

            setTimeout(() => handleNavigate("/login"), 1500)
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Registration failed. Please try again."
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <h2>Register</h2>
            {success && <p className="success-msg">{success}</p>}
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-input">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="file"
                        name="avatar"
                        placeholder="Avatar URL (optional)"
                        value={formData.avatar}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="register-btn"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <span
                    className="login-link"
                    onClick={() => !loading && handleNavigate("/login")}
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        color: "blue",
                    }}
                >
                    Login
                </span>
            </p>
        </div>
    )
}
