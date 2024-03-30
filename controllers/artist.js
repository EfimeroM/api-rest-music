const mongoosePagination = require("mongoose-pagination")
const fs = require("fs")
const path = require("path")

const Artist = require("../models/Artist")
const Album = require("../models/Album")
const Song = require("../models/Song")
const { checkFileExtension } = require("../helpers/fileManager")

const save = async (req, res) => {
  const params = req.body
  try {

    const artistStored = await Artist.create(params)
    if (!artistStored) throw new Error("Failed to create artist")

    return res.status(201).json({ status: "success", message: "Artist saved", artist: artistStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save artist" })
  }
}

const one = async (req, res) => {
  const { id } = req.params

  try {
    const artistDb = await Artist.findById(id)
    if (!artistDb) return res.status(404).json({ status: "error", message: "Artist not found" })

    return res.status(200).json({ status: "success", message: "Get an artist", artist: artistDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get an artist" })
  }
}

const list = async (req, res) => {
  const page = parseInt(req.params.page) || 1
  const itemsPerPage = 5

  try {
    const artistsDb = await Artist.find().sort("name").paginate(page, itemsPerPage)
    if (!artistsDb) return res.status(404).json({ status: "error", message: "Artists not found" })

    const total = await Artist.countDocuments()

    return res.status(200).json({
      status: "success", message: "List Artist",
      page,
      pages: Math.ceil(total / itemsPerPage),
      itemsPerPage,
      total,
      artist: artistsDb
    })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to list artists" })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body

  try {
    const artistUpdated = await Artist.findByIdAndUpdate(id, data, { new: true })
    if (!artistUpdated) return res.status(404).json({ status: "error", message: "Artist not found" })

    return res.status(200).json({ status: "success", message: "Artist updated", artist: artistUpdated })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to update artist" })
  }
}

const remove = async (req, res) => {
  const { id } = req.params

  try {
    const artistRemoved = await Artist.findByIdAndDelete(id)
    if (!artistRemoved) return res.status(404).json({ status: "error", message: "Artist not found" })

    //delete albums and songs
    const albumsDb = await Album.find({ artist: artistRemoved._id })
    albumsDb.forEach(async (album) => {
      await Song.deleteMany({ album: album._id })
      await Album.findByIdAndDelete(album._id)
    });

    return res.status(200).json({ status: "success", message: "Artist and his albums and songs deleted", artistRemoved })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to delete artist" })
  }
}

const uploadImage = async (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(404).json({ status: "error", message: "Error file not found" })

  const result = checkFileExtension(req.file, "image")
  if (!result) return res.status(400).json({ status: "error", message: "Error invalid file" })

  try {

    const artistUpdated = await Artist.findOneAndUpdate({ _id: id }, { image: req.file.filename }, { new: true })
    if (!artistUpdated) return res.status(400).json({ status: "error", message: "Error updating artist image" })

    return res.status(200).json({ status: "success", message: "Image uploaded", artist: artistUpdated, file: req.file })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error updating artist image" })
  }
}

const image = async (req, res) => {
  const file = req.params.file
  const filePath = `./uploads/artists/${file}`

  fs.stat(filePath, (error, exists) => {
    if (!exists) return res.status(404).json({ status: "error", message: "Image not found", exists, file, filePath })
    return res.sendFile(path.resolve(filePath))
  })
}

module.exports = {
  save,
  one,
  list,
  update,
  remove,
  uploadImage,
  image
}