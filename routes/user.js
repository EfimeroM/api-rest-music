const express = require("express")
const UserController = require("../controllers/user")
const { validateRegisterInput, validateUpdateInput } = require("../middlewares/validateInputs")
const check = require("../middlewares/auth")
const { configMulter } = require("../middlewares/multer")

const router = express.Router()

const uploads = configMulter("./uploads/avatars", "avatar")

router.post("/register", validateRegisterInput, UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id", check.auth, UserController.profile)
router.put("/update", [check.auth, validateUpdateInput], UserController.update)
router.post("/upload", [check.auth, uploads.single("file0")], UserController.uploadImage)
router.get("/avatar/:file", UserController.avatar )

module.exports = router