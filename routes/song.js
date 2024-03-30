const express = require("express")
const SongController = require("../controllers/song")
const check = require("../middlewares/auth")
const { configMulter } = require("../middlewares/multer")

const router = express.Router()

const uploads = configMulter("./uploads/songs", "song")

router.post("/save", check.auth, SongController.save)
router.get("/one/:id", check.auth, SongController.one)
router.get("/list/:albumId", check.auth, SongController.list)
router.put("/update/:id", check.auth, SongController.update)
router.delete("/remove/:id", check.auth, SongController.remove)
router.post("/upload/:id", [check.auth, uploads.single("file0")], SongController.uploadSong)
router.get("/audio/:file", SongController.audio)

module.exports = router