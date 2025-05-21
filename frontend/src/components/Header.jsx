import axios from "axios"
import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Header({ handleNavigate }) {
    const [buttonText, setButtonText] = useState("User")
    const [avatar, setAvatar] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchUserData(token)
        } else {
            setButtonText("User")
            setAvatar(null)
        }
    }, [])

    const fetchUserData = async (token) => {
        try {
            const response = await api.get("/api/v1/user/current-user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const { username, avatar } = response.data.data
            setButtonText(username)
            setAvatar(avatar)
        } catch (error) {
            console.error("Error fetching user data: ", error)
            setButtonText("User")
            setAvatar(null)
        }
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token")
            await api.post(
                "/api/v1/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            localStorage.removeItem("token")
            setButtonText("User")
            setAvatar(null)
            setIsPopupOpen(false)
            handleNavigate("/login")
        } catch (error) {
            console.error("Error logging out: ", error)
        }
    }

    const handleUserClick = () => {
        if (avatar) {
            setIsPopupOpen(!isPopupOpen)
        }
    }

    const handleLoginClick = () => {
        handleNavigate("/login")
    }

    const handleRegisterClick = () => {
        handleNavigate("/register")
    }

    return (
        <header className="header">
            <h1 title="अर्थ निरीक्षण">Artha Nirikshan</h1>
            <div className="header-buttons">
                {avatar ? (
                    <>
                        <button
                            className="user-header-btn"
                            onClick={handleUserClick}
                        >
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="avatar-img"
                            />
                            <span className="username">{buttonText}</span>
                        </button>
                        {isPopupOpen && (
                            <div className="user-popup">
                                <button
                                    className="popup-logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            className="login-btn"
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                        <button
                            className="register-btn"
                            onClick={handleRegisterClick}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
