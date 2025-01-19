import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { annualRecords, recordsDashboard } from "../controllers/dashboard.controller.js"

const router = Router()
router.use(verifyJWT)

router.route("/").get(recordsDashboard)
router.route("/annual").get(annualRecords)

export default router
