import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createRecord,
    deleteAllRecords,
    deleteRecord,
    getUserRecords,
} from "../controllers/record.controller.js"

const router = Router()
router.use(verifyJWT)

router.route("/").get(getUserRecords)
router.route("/create").post(createRecord)
router.route("/delete/:recordId").delete(deleteRecord)
router.route("/delete-all").delete(deleteAllRecords)

export default router
