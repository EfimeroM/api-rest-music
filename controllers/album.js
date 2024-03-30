const fs = require("fs")
const path = require("path")

const Album = require("../models/Album")
const Song = require("../models/Song")
const { checkFileExtension } = require("../helpers/fileManager")

const save = async (req, res) => {
  const params = req.body

  try {
    const albumStored = await Album.create(params)
    if (!albumStored) throw new Error("Failed to create album")

    res.status(200).json({ status: "success", message: "Save Album", album: albumStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save album" })
  }
}

const one = async (req, res) => {
  const { id } = req.params

  try {
    const albumDb = await Album.findById(id).populate("artist", "-__v")
    if (!albumDb) throw new Error("Failed to get album")

    res.status(200).json({ status: "success", message: "Get Album", album: albumDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get album" })
  }
}

const list = async (req, res) => {
  const { artistId } = req.params
  if (!artistId) return res.status(404).json({ status: "error", message: "Error artist not found" })

  try {
    const albumsDb = await Album.find({ artist: artistId }).populate("artist", "-__v")
    if (!albumsDb) throw new Error("Error albums not found")

    res.status(200).json({ status: "success", message: "Get list of albums", albums: albumsDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get album" })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body

  try {
    const albumUpdated = await Album.findByIdAndUpdate(id, data, { new: true })
    if (!albumUpdated) return res.status(404).json({ status: "error", message: "Error album not found" })

    res.status(200).json({ status: "success", message: "Update album", album: albumUpdated })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to update album" })
  }
}

const uploadImage = async (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(404).json({ status: "error", message: "Error file not found" })

  const result = checkFileExtension(req.file, "image")
  if (!result) return res.status(400).json({ status: "error", message: "Error invalid file" })

  try {

    const albumUpdated = await Album.findOneAndUpdate({ _id: id }, { image: req.file.filename }, { new: true })
    if (!albumUpdated) return res.status(400).json({ status: "error", message: "Error updating album image" })

    return res.status(200).json({ status: "success", message: "Image uploaded", album: albumUpdated, file: req.file })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error updating album image" })
  }
}

const image = async (req, res) => {
  const file = req.params.file
  const filePath = `./uploads/albums/${file}`

  fs.stat(filePath, (error, exists) => {
    if (!exists) return res.status(404).json({ status: "error", message: "Image not found", exists, file, filePath })
    return res.sendFile(path.resolve(filePath))
  })
}

const remove = async (req, res) => {
  const { id } = req.params

  try {
    //delete album and their songs
    const albumRemoved = await Album.findByIdAndDelete(id)
    if (!albumRemoved) return res.status(404).json({ status: "error", message: "Artist's album not found" })

    const songsRemoved = await Song.deleteMany({ album: id })

    return res.status(200).json({ status: "success", message: "Albums and their songs deleted", albumRemoved, songsRemoved })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to delete album" })
  }
}

module.exports = {
  save,
  one,
  list,
  update,
  uploadImage,
  image,
  remove
}