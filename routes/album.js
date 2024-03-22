const express = require("express")
const AlbumController = require("../controllers/album")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/save", check.auth, AlbumController.save)
router.get("/one/:id", check.auth, AlbumController.one)
router.get("/list/:artistId", check.auth, AlbumController.list)

module.exports = router