const express = require("express")
const ArtistController = require("../controllers/artist")
const check = require("../middlewares/auth")
const multer = require("multer")

const router = express.Router()

//config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/artists"),
  filename: (req, file, cb) => cb(null, `artist-${Date.now()}-${file.originalname}`)
})
const uploads = multer({ storage })

router.post("/save", check.auth, ArtistController.save)
router.get("/one/:id", check.auth, ArtistController.one)
router.get("/list/:page?", check.auth, ArtistController.list)
router.put("/update/:id", check.auth, ArtistController.update)
router.delete("/remove/:id", check.auth, ArtistController.remove)
router.post("/upload/:id", [check.auth, uploads.single("file0")], ArtistController.uploadImage)
router.get("/image/:file", ArtistController.image )

module.exports = router