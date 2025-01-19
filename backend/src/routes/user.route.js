import { Router } from "express"
import {
    changeCurrentPassword,
    getUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.single([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-profile").patch(verifyJWT, updateAccountDetails)

// router
//     .route("/update-avatar")
//     .patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router
