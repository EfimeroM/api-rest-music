const express = require("express")
const UserController = require("../controllers/user")
const { validateRegisterInput, validateUpdateInput } = require("../middlewares/validateInputs")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/register", validateRegisterInput, UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id", check.auth, UserController.profile)
router.put("/update", [check.auth, validateUpdateInput], UserController.update)
router.post("/upload", check.auth, UserController.upload)

module.exports = router