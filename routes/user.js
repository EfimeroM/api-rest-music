const express = require("express")
const UserController = require("../controllers/user")
const { validateRegisterInput, validateUpdateInput } = require("../middlewares/validateInputs")
const check = require("../middlewares/auth")
const multer = require("multer")

const router = express.Router()

//config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/avatars"),
  filename: (req, file, cb) => cb(null, `avatar-${Date.now()}-${file.originalname}`)
})
const uploads = multer({ storage })

router.post("/register", validateRegisterInput, UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id", check.auth, UserController.profile)
router.put("/update", [check.auth, validateUpdateInput], UserController.update)
router.post("/upload", [check.auth, uploads.single("file0")], UserController.uploadImage)
router.get("/avatar/:file", UserController.avatar )

module.exports = router