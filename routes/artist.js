const express = require("express")
const ArtistController = require("../controllers/artist")
const check = require("../middlewares/auth")
const { configMulter } = require("../middlewares/multer")

const router = express.Router()

const uploads = configMulter("./uploads/artists", "artist")

router.post("/save", check.auth, ArtistController.save)
router.get("/one/:id", check.auth, ArtistController.one)
router.get("/list/:page?", check.auth, ArtistController.list)
router.put("/update/:id", check.auth, ArtistController.update)
router.delete("/remove/:id", check.auth, ArtistController.remove)
router.post("/upload/:id", [check.auth, uploads.single("file0")], ArtistController.uploadImage)
router.get("/image/:file", ArtistController.image )

module.exports = router