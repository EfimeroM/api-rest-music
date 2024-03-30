const fs = require("fs")

const checkFileExtension = (file, fileType) => {
  let extensions = []

  switch (fileType) {
    case "image":
      extensions = ["png", "jpg", "jpeg", "gif"]
      break;
    case "song":
      extensions = ["mp3", "mp4"]
      break;
    default:
      extensions = ["png", "jpg", "jpeg", "gif"]
      break;
  }

  const fileName = file.originalname
  const splitFile = fileName.split(".")
  const fileExtension = splitFile[1]
  if (!extensions.includes(fileExtension)) {
    fs.unlinkSync(file.path)
    return false
  }
  return true
}

module.exports = {
  checkFileExtension
}