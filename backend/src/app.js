import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
        origin: [
            "https://artha-nirikshana.vercel.app",
            "http://localhost:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

// Common Middlewares
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Import Routes
import healthcheckRouter from "./routes/healthcheck.route.js"
import userRouter from "./routes/user.route.js"
import recordRouter from "./routes/record.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import walletRouter from "./routes/wallet.route.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

// Use Routes
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/records", recordRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/wallet", walletRouter)

// Global Error Handler Middleware
app.use(errorHandler)

export { app }
