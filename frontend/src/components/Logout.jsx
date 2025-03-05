import { useState, useEffect } from "react"
import axios from "axios"

export default function Header({ handleNavigate }) {
    const [buttonText, setButtonText] = useState("Guest")
    const [avatar, setAvatar] = useState(null)
    const [logoutMessage, setLogoutMessage] = useState("")
    const [logoutError, setLogoutError] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchUserData(token)
        } else {
            setButtonText("Login")
            setAvatar(null)
        }
    }, [])

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("/api/v1/user/current-user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const { username, avatar } = response.data.data
            setButtonText(username)
            setAvatar(avatar)
        } catch (error) {
            console.error("Error fetching user data: ", error)
            setButtonText("Login")
            setAvatar(null)
        }
    }

    const handleLogout = async () => {
        setLogoutMessage("")
        setLogoutError("")
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(
                "/api/v1/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            localStorage.removeItem("token")
            setLogoutMessage(response.data.message)
            setButtonText("Login")
            setAvatar(null)
            setTimeout(() => handleNavigate("/login"), 1500)
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Logout failed. Please try again."
            setLogoutError(errorMessage)
        }
    }

    const handleButtonClick = () => {
        if (!avatar) {
            handleNavigate("/login")
        } else {
            handleLogout()
        }
    }

    return (
        <header className="header">
            <h1 title="अर्थ निरीक्षण">Artha Nirikshan</h1>
            {logoutMessage && <p className="success-msg">{logoutMessage}</p>}
            {logoutError && <p className="error-msg">{logoutError}</p>}
            {avatar ? (
                <button className="user-header-btn" onClick={handleButtonClick}>
                    <img src={avatar} alt="Avatar" className="avatar-img" />
                    <span className="username">{buttonText}</span>
                </button>
            ) : (
                <button className="login-btn" onClick={handleButtonClick}>
                    <span className="login-text">{buttonText}</span>
                </button>
            )}
        </header>
    )
}
