const express = require("express")
const AlbumController = require("../controllers/album")
const check = require("../middlewares/auth")
const multer = require("multer")

const router = express.Router()

//config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/albums"),
  filename: (req, file, cb) => cb(null, `album-${Date.now()}-${file.originalname}`)
})
const uploads = multer({ storage })

router.post("/save", check.auth, AlbumController.save)
router.get("/one/:id", check.auth, AlbumController.one)
router.get("/list/:artistId", check.auth, AlbumController.list)
router.put("/update/:id", check.auth, AlbumController.update)
router.post("/upload/:id", [check.auth, uploads.single("file0")], AlbumController.uploadImage)
router.get("/image/:file", AlbumController.image )

module.exports = router