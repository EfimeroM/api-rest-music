const express = require("express")
const AlbumController = require("../controllers/album")
const check = require("../middlewares/auth")
const { configMulter } = require("../middlewares/multer")

const router = express.Router()

const uploads = configMulter("./uploads/albums", "album")

router.post("/save", check.auth, AlbumController.save)
router.get("/one/:id", check.auth, AlbumController.one)
router.get("/list/:artistId", check.auth, AlbumController.list)
router.put("/update/:id", check.auth, AlbumController.update)
router.post("/upload/:id", [check.auth, uploads.single("file0")], AlbumController.uploadImage)
router.get("/image/:file", AlbumController.image )
router.delete("/remove/:id", check.auth, AlbumController.remove)

module.exports = router