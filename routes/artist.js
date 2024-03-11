const express = require("express")
const ArtistController = require("../controllers/artist")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/save", check.auth, ArtistController.save)

module.exports = router