const express = require("express")
const UserController = require("../controllers/user")
const { validateRegisterInput } = require("../middlewares/validateInputs")

const router = express.Router()

router.post("/register", validateRegisterInput, UserController.register)
router.post("/login", UserController.login)

module.exports = router