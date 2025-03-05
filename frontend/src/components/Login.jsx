import { useState } from "react"
import axios from "axios"

export default function Login({ handleNavigate }) {
    const [credentials, setCredentials] = useState({
        usernameOrEmail: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, serError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        serError(null)
        setSuccess(null)

        try {
            const response = await axios.post("/api/v1/user/login", {
                username: credentials.usernameOrEmail.includes("@")
                    ? undefined
                    : credentials.usernameOrEmail,
                email: credentials.usernameOrEmail.includes("@")
                    ? credentials.usernameOrEmail
                    : undefined,
                password: credentials.password,
            })

            const { accessToken } = response.data.data
            localStorage.setItem("token", accessToken)
            setSuccess(response.data.message)

            setTimeout(() => {
                handleNavigate("/dashboard")
            }, 1500)
        } catch (error) {
            serError(
                error.response?.data?.message ||
                    "Login failed. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            {success && <p className="success-msg">{success}</p>}
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-input">
                    <input
                        type="text"
                        name="usernameOrEmail"
                        placeholder="Username or Email"
                        value={credentials.usernameOrEmail}
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
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading} className="login-btn">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>
                Don’t have an account?{" "}
                <span
                    className="register-link"
                    onClick={() => !loading && handleNavigate("/register")}
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        color: "blue",
                    }}
                >
                    Register
                </span>
            </p>
        </div>
    )
}
