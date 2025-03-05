import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addWalletBalance,
    changeWalletName,
    createWallet,
    deleteWallet,
    userWallet,
} from "../controllers/wallet.controller.js"

const router = Router()
router.use(verifyJWT)

router.route("/").get(userWallet)
router.route("/create-wallet").post(createWallet)
router.route("/add-balance").patch(addWalletBalance)
router.route("/change-wallet-name").patch(changeWalletName)
router.route("/delete-wallet").post(deleteWallet)

export default router
