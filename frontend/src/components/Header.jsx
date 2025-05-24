import { useEffect, useState, useRef } from "react"
import api from "../api/axios"
import { Sling as Hamburger } from "hamburger-react"

export default function Header({ handleNavigate }) {
    const [buttonText, setButtonText] = useState("User")
    const [avatar, setAvatar] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isOpen, setOpen] = useState(window.innerWidth >= 1080)
    const navRef = useRef(null)

    // Scroll lock and cleanup for mobile only
    useEffect(() => {
        if (isOpen && window.innerWidth < 1080) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setOpen(window.innerWidth >= 1080)
        }
        window.addEventListener("popstate", handleRouteChange)
        return () => {
            window.removeEventListener("popstate", handleRouteChange)
        }
    }, [])

    // Close menu on click outside for mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                window.innerWidth < 1080 &&
                navRef.current &&
                !navRef.current.contains(event.target)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    // Update isOpen on window resize
    useEffect(() => {
        const handleResize = () => {
            setOpen(window.innerWidth >= 1080)
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token")
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
            <Hamburger
                toggled={isOpen}
                toggle={setOpen}
                aria-controls="main-nav"
                aria-label="Toggle main navigation"
            />
            <nav
                ref={navRef}
                id="main-nav"
                className="header-nav"
                aria-label="Main navigation"
                aria-hidden={window.innerWidth < 1080 && !isOpen}
                style={
                    window.innerWidth < 1080
                        ? {
                              position: "fixed",
                              top: isOpen ? "0" : "-110%",
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "transparent",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "top 0.3s ease-in-out",
                              zIndex: isOpen ? "1000" : "-1",
                              pointerEvents: isOpen ? "auto" : "none",
                              gap: isOpen ? "1rem" : "0",
                          }
                        : {
                              position: "static",
                              width: "auto",
                              height: "auto",
                              background: "none",
                              zIndex: "auto",
                              pointerEvents: "auto",
                              gap: "1rem",
                          }
                }
            >
                <ul className="nav-list">
                    {/* <li>
                        <button
                            className="nav-btn"
                            onClick={() => {
                                if (!loading) {
                                    handleNavigate("/")
                                    setOpen(window.innerWidth >= 1080)
                                }
                            }}
                            disabled={loading}
                            aria-current={
                                window.location.pathname === "/"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Home
                        </button>
                    </li> */}
                    {/* <li>
                        <button
                            className="nav-btn"
                            onClick={() => {
                                if (!loading) {
                                    handleNavigate("/healthcheck")
                                    setOpen(window.innerWidth >= 1080)
                                }
                            }}
                            disabled={loading}
                            aria-current={
                                window.location.pathname === "/healthcheck"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Healthcheck
                        </button>
                    </li> */}
                    {avatar ? (
                        <>
                            <li>
                                <button
                                    className="nav-btn"
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/dashboard")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/dashboard/annual")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/records")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/records/create")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/login")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (!loading) {
                                            handleNavigate("/register")
                                            setOpen(window.innerWidth >= 1080)
                                        }
                                    }}
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
                                    onError={() => setAvatar(null)}
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
