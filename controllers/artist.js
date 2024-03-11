const Artist = require("../models/Artist")
const mongoosePagination = require("mongoose-pagination")

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

  const artistUpdated = await Artist.findByIdAndUpdate(id, data, { new: true })
  if(!artistUpdated) return res.status(404).json({ status: "error", message: "Artist not found" })

  return res.status(200).json({ status: "success", message: "Artist updated", artist: artistUpdated })
}

module.exports = {
  save,
  one,
  list,
  update
}