import axios from "axios"
import api from "../api/axios"
import { useEffect, useState } from "react"


export default function Healthcheck() {

    const [data, setData] = useState("Loading...")

    const fetchHealthcheck = async () => {
        try {
            const response = await api.get("/api/v1/healthcheck")
            console.log(response.data.message)
            setData(response.data.message)
        } catch (error) {
            console.error("Error fetching Healthcheck: ", error)
            setData("Error fetching data")
        }
    }

    useEffect(() => {
        fetchHealthcheck()
    }, [])
    

    return (
        <h1>
            {data}
        </h1>
    )
}