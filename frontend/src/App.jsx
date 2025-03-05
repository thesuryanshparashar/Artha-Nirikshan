import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import Healthcheck from "./components/Healthcheck"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import Logout from "./components/Logout"
import CreateRecord from "./components/createRecord"
import UserRecords from "./components/UsserRecords"
import RecordsDashboard from "./components/RecordsDashboard"
import AnnualRecords from "./components/AnnualRecords"

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname)
        }

        window.addEventListener("popstate", handleLocationChange)

        return () => {
            window.removeEventListener("popstate", handleLocationChange)
        }
    }, [])

    const handleNavigate = (path) => {
        window.history.pushState({}, "", path)
        setCurrentPath(path)
    }

    const renderComponent = () => {
        switch (currentPath) {
            case "/":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <Home />
                    </>
                )
            case "/healthcheck":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <Healthcheck />
                    </>
                )
            case "/register":
                return <Register handleNavigate={handleNavigate} />
            case "/login":
                return <Login handleNavigate={handleNavigate} />
            case "/logout":
                return <Logout handleNavigate={handleNavigate} />
            case "/dashboard":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <RecordsDashboard handleNavigate={handleNavigate} />
                    </>
                )
            case "/dashboard/annual":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <AnnualRecords handleNavigate={handleNavigate} />
                    </>
                )
            case "/records":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <UserRecords handleNavigate={handleNavigate} />
                    </>
                )
            case "/records/create":
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <CreateRecord handleNavigate={handleNavigate} />
                    </>
                )
            default:
                return (
                    <>
                        <Header handleNavigate={handleNavigate} />
                        <Home />
                    </>
                )
        }
    }

    return <div>{renderComponent()}</div>
}

export default App
