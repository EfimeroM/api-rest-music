const express = require("express")
const SongController = require("../controllers/song")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/save", check.auth, SongController.save)
router.get("/one/:id", check.auth, SongController.one)

module.exports = router