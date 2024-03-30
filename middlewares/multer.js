const multer = require("multer")

const configMulter = (path, name) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path),
    filename: (req, file, cb) => cb(null, `${name}-${Date.now()}-${file.originalname}`)
  })
  return multer({ storage })
}


module.exports = { configMulter }