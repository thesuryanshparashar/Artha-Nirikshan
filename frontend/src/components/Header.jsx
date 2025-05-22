import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Header({ handleNavigate }) {
    const [buttonText, setButtonText] = useState("User")
    const [avatar, setAvatar] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token") // Replace with cookie-based check if using httpOnly
        if (token) {
            fetchUserData(token)
        }
    }, [])

    const fetchUserData = async (token) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get("/api/v1/user/current-user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const { username, avatar } = response.data.data
            setButtonText(username || "User")
            setAvatar(avatar)
        } catch (error) {
            console.error("Error fetching user data:", error)
            setError("Failed to load user data.")
            setButtonText("User")
            setAvatar(null)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem("token") // Replace if using cookies
            await api.post(
                "/api/v1/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            localStorage.removeItem("token") // Clear token
            setButtonText("User")
            setAvatar(null)
            setIsPopupOpen(false)
            handleNavigate("/login")
        } catch (error) {
            console.error("Error logging out:", error)
            setError("Failed to log out. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleUserClick = () => {
        if (avatar) {
            setIsPopupOpen(!isPopupOpen)
        }
    }

    const closePopup = () => {
        setIsPopupOpen(false)
    }

    return (
        <header className="header" role="banner">
            <h1
                className="header-title"
                title="अर्थ निरीक्षण"
                onClick={() => !loading && handleNavigate("/")}
                onKeyDown={(e) =>
                    !loading && e.key === "Enter" && handleNavigate("/")
                }
                role="button"
                tabIndex={0}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
                Artha Nirikshan
            </h1>
            {error && (
                <p className="error-msg" role="alert">
                    {error}
                </p>
            )}
            <nav className="header-nav" aria-label="Main navigation">
                <ul className="nav-list">
                    <li>
                        <button
                            className="nav-btn"
                            onClick={() => !loading && handleNavigate("/")}
                            disabled={loading}
                            aria-current={
                                window.location.pathname === "/"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button
                            className="nav-btn"
                            onClick={() =>
                                !loading && handleNavigate("/healthcheck")
                            }
                            disabled={loading}
                            aria-current={
                                window.location.pathname === "/healthcheck"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Healthcheck
                        </button>
                    </li>
                    {avatar ? (
                        <>
                            <li>
                                <button
                                    className="nav-btn"
                                    onClick={() =>
                                        !loading && handleNavigate("/dashboard")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname ===
                                        "/dashboard"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    className="nav-btn"
                                    onClick={() =>
                                        !loading &&
                                        handleNavigate("/dashboard/annual")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname ===
                                        "/dashboard/annual"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Annual Records
                                </button>
                            </li>
                            <li>
                                <button
                                    className="nav-btn"
                                    onClick={() =>
                                        !loading && handleNavigate("/records")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname === "/records"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Records
                                </button>
                            </li>
                            <li>
                                <button
                                    className="nav-btn"
                                    onClick={() =>
                                        !loading &&
                                        handleNavigate("/records/create")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname ===
                                        "/records/create"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Create Record
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button
                                    className="nav-btn login-btn"
                                    onClick={() =>
                                        !loading && handleNavigate("/login")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname === "/login"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Login
                                </button>
                            </li>
                            <li>
                                <button
                                    className="nav-btn register-btn"
                                    onClick={() =>
                                        !loading && handleNavigate("/register")
                                    }
                                    disabled={loading}
                                    aria-current={
                                        window.location.pathname === "/register"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    Register
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {avatar && (
                <div className="user-section">
                    <button
                        className="user-header-btn"
                        onClick={handleUserClick}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleUserClick()
                        }
                        aria-expanded={isPopupOpen}
                        aria-controls="user-popup"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                <img
                                    src={avatar}
                                    alt={`${buttonText}'s avatar`}
                                    className="avatar-img"
                                    onError={() => setAvatar(null)} // Fallback if image fails
                                />
                                <span className="username">{buttonText}</span>
                            </>
                        )}
                    </button>
                    {isPopupOpen && (
                        <div
                            className="user-popup"
                            id="user-popup"
                            role="dialog"
                            aria-label="User menu"
                        >
                            <button
                                className="popup-logout-btn"
                                onClick={handleLogout}
                                disabled={loading}
                                aria-busy={loading ? "true" : "false"}
                            >
                                {loading ? "Logging out..." : "Logout"}
                            </button>
                            <button
                                className="popup-close-btn"
                                onClick={closePopup}
                                disabled={loading}
                                aria-label="Close user menu"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
