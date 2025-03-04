import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

// Common Middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
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
