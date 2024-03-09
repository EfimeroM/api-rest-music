const express = require("express")
const UserController = require("../controllers/user")
const { validateRegisterInput } = require("../middlewares/validateInputs")

const router = express.Router()

router.post("/register", validateRegisterInput, UserController.register)

module.exports = router