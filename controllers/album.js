const Album = require("../models/Album")

const save = async (req, res) => {
  const params = req.body

  try {
    const albumStored = await Album.create(params)
    if (!albumStored) throw Error

    res.status(200).json({ status: "success", message: "Save Album", album: albumStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save album" })
  }
}

const one = async (req, res) => {
  const { id } = req.params

  try {
    const albumDb = await Album.findById(id).populate("artist", "-__v")
    if (!albumDb) throw Error

    res.status(200).json({ status: "success", message: "Get Album", album: albumDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get album" })
  }
}

module.exports = {
  save,
  one
}