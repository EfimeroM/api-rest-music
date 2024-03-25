const Song = require("../models/Song")

const save = async (req, res) => {
  const params = req.body

  try {
    const songStored = await Song.create(params)
    if (!songStored) throw Error

    res.status(200).json({ status: "success", message: "Save user", song: songStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save song" })
  }
}

const one = async (req, res) => {
  const { id } = req.params

  try {
    const songDb = await Song.findById(id).populate("album", "-__v")
    if (!songDb) res.status(404).json({ status: "error", message: "Error song not found" })

    res.status(200).json({ status: "success", message: "get song", song: songDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get song" })
  }
}

const list = async (req, res) => {
  const { albumId } = req.params

  try {
    const songsDb = await Song
      .find({ album: albumId })
      .populate({ path: "album", populate: { path: "artist", model: "Artist" } })
      .sort("track")
    if (!songsDb) res.status(404).json({ status: "error", message: "Error songs not found" })

    res.status(200).json({ status: "success", message: "get list songs", songs: songsDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get songs" })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const songUpdated = await Song.findByIdAndUpdate(id, data, { new: true })
    if (!songUpdated) res.status(404).json({ status: "error", message: "Error song not found" })

    res.status(200).json({ status: "success", message: "update song", songUpdated })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to update song" })
  }
}

module.exports = {
  save,
  one,
  list,
  update
}