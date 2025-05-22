import { useState } from "react"
import axios from "axios"
import api from "../api/axios"

export default function Login({ handleNavigate }) {
    const [credentials, setCredentials] = useState({
        usernameOrEmail: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const validateCredentials = () => {
        const { usernameOrEmail, password } = credentials
        if (!usernameOrEmail || !password) {
            return "Please fill in all fields."
        }
        if (
            usernameOrEmail.includes("@") &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)
        ) {
            return "Invalid email format."
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters."
        }
        return null
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const validationError = validateCredentials()
        if (validationError) {
            setError(validationError)
            setLoading(false)
            return
        }

        try {
            const response = await api.post("/api/v1/user/login", {
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

            handleNavigate("/dashboard")
        } catch (error) {
            const status = error.response?.status
            let message = "Login failed. Please try again."
            if (status === 401) {
                message = "Invalid username/email or password."
            } else if (status === 500) {
                message = "Server error. Please try again later."
            } else if (!error.response) {
                message = "Network error. Check your connection."
            } else {
                message = error.response?.data?.message || message
            }
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            {success && (
                <p className="success-msg" role="alert">
                    {success}
                </p>
            )}
            {error && (
                <p className="error-msg" role="alert">
                    {error}
                </p>
            )}
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
                        aria-invalid={error ? "true" : "false"}
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
                        aria-invalid={error ? "true" : "false"}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="login-btn"
                    aria-busy={loading ? "true" : "false"}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>
                Don’t have an account?{" "}
                <button
                    type="button"
                    className="register-link"
                    onClick={() => !loading && handleNavigate("/register")}
                    disabled={loading}
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        color: "blue",
                    }}
                >
                    Register
                </button>
            </p>
        </div>
    )
}
