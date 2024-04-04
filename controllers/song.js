const fs = require("fs")
const path = require("path")

const Song = require("../models/Song")
const { checkFileExtension } = require("../helpers/fileManager")

const save = async (req, res) => {
  const params = req.body

  try {
    const songStored = await Song.create(params)
    if (!songStored) throw new Error("Failed to create song")

    res.status(201).json({ status: "success", message: "Saved song", song: songStored })
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

    res.status(200).json({ status: "success", message: "get list of songs", songs: songsDb })
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

    res.status(200).json({ status: "success", message: "updated song", songUpdated })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to update song" })
  }
}

const remove = async (req, res) => {
  const { id } = req.params
  try {
    const songRemoved = await Song.findByIdAndDelete(id)
    if (!songRemoved) res.status(404).json({ status: "error", message: "Error song not found" })

    res.status(200).json({ status: "success", message: "deleted song", songRemoved })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to delete song" })
  }
}

const uploadSong = async (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(404).json({ status: "error", message: "Error file not found" })

  const result = checkFileExtension(req.file, "audio")
  if (!result) return res.status(400).json({ status: "error", message: "Error invalid file" })

  try {

    const songUpdated = await Song.findOneAndUpdate({ _id: id }, { file: req.file.filename }, { new: true })
    if (!songUpdated) return res.status(400).json({ status: "error", message: "Error updating song file" })

    return res.status(200).json({ status: "success", message: "Song file uploaded", song: songUpdated, file: req.file })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error updating song file" })
  }
}

const audio = async (req, res) => {
  const file = req.params.file
  const filePath = `./uploads/songs/${file}`

  fs.stat(filePath, (error, exists) => {
    if (!exists) return res.status(404).json({ status: "error", message: "Song not found", exists, file, filePath })
    return res.sendFile(path.resolve(filePath))
  })
}

module.exports = {
  save,
  one,
  list,
  update,
  remove,
  uploadSong,
  audio
}