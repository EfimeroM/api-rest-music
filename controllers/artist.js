const Artist = require("../models/Artist")
const mongoosePagination = require("mongoose-pagination")
const fs = require("fs")
const path = require("path")

const save = async (req, res) => {
  const params = req.body
  try {

    const artistStored = await Artist.create(params)
    if (!artistStored) throw Error

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
    //remove albums
    //remove songs
    if (!artistRemoved) return res.status(404).json({ status: "error", message: "Artist not found" })

    return res.status(200).json({ status: "success", message: "Artist deleted", artistRemoved })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to delete artist" })
  }
}

const uploadImage = async (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(404).json({ status: "error", message: "Error file not found" })

  const fileName = req.file.originalname
  const splitFile = fileName.split(".")
  const fileExtension = splitFile[1]
  if (!["png", "jpg", "jpeg", "gif"].includes(fileExtension)) {
    fs.unlinkSync(req.file.path)
    return res.status(400).json({ status: "error", message: "Error invalid file" })
  }

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