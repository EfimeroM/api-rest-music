const express = require("express")
const ArtistController = require("../controllers/artist")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/save", check.auth, ArtistController.save)
router.get("/one/:id", check.auth, ArtistController.one)
router.get("/list/:page?", check.auth, ArtistController.list)

module.exports = router