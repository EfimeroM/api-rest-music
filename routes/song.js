const express = require("express")
const SongController = require("../controllers/song")
const check = require("../middlewares/auth")

const router = express.Router()

router.post("/save", check.auth, SongController.save)
router.get("/one/:id", check.auth, SongController.one)
router.get("/list/:albumId", check.auth, SongController.list)
router.put("/update/:id", check.auth, SongController.update)
router.delete("/remove/:id", check.auth, SongController.remove)

module.exports = router